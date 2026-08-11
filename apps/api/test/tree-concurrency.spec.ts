import { BadRequestException, ConflictException } from '@nestjs/common';
import { validateStateTransition } from '@common/domain/domain-state-machine';
import { CultivationService } from '@modules/cultivation/services/cultivation.service';

describe('Tree Concurrency & State Machine Hardening', () => {
    describe('Layer 1: Domain State Machine Validation', () => {
        it('should allow valid transition: planted -> growing', () => {
            expect(() => validateStateTransition('Tree', 'planted', 'growing')).not.toThrow();
        });

        it('should allow valid transition: growing -> available', () => {
            expect(() => validateStateTransition('Tree', 'growing', 'available')).not.toThrow();
        });

        it('should allow valid transition: available -> harvested', () => {
            expect(() => validateStateTransition('Tree', 'available', 'harvested')).not.toThrow();
        });

        it('should allow valid transition: harvested -> sold', () => {
            expect(() => validateStateTransition('Tree', 'harvested', 'sold')).not.toThrow();
        });

        it('should reject invalid transition: planted -> sold', () => {
            expect(() => validateStateTransition('Tree', 'planted', 'sold')).toThrow(BadRequestException);
        });

        it('should reject invalid transition: growing -> sold', () => {
            expect(() => validateStateTransition('Tree', 'growing', 'sold')).toThrow(BadRequestException);
        });

        it('should reject invalid transition: sold -> available', () => {
            expect(() => validateStateTransition('Tree', 'sold', 'available')).toThrow(BadRequestException);
        });
    });

    describe('Layer 2: Database Concurrency Protection Simulation', () => {
        let repositoryMock: any;
        let service: CultivationService;

        beforeEach(() => {
            repositoryMock = {
                getTreeDetail: jest.fn(),
                updateTree: jest.fn(),
                updateTreeWithConcurrencyCheck: jest.fn(),
            };
            service = new CultivationService(repositoryMock, {} as any);
        });

        it('should allow first request to update status and reject concurrent second request with ConflictException', async () => {
            const treeId = 'tree-123';
            repositoryMock.getTreeDetail.mockResolvedValue({
                id: treeId,
                status: 'available',
            });

            // First request succeeds
            repositoryMock.updateTreeWithConcurrencyCheck.mockResolvedValueOnce({
                id: treeId,
                status: 'sold',
            });

            // Second concurrent request gets count: 0 -> throws ConflictException
            repositoryMock.updateTreeWithConcurrencyCheck.mockRejectedValueOnce(
                new ConflictException('Tree status was updated concurrently by another request')
            );

            // Request A
            const resA = await service.updateTree(treeId, { status: 'sold' } as any);
            expect(resA.data?.status).toBe('sold');

            // Request B (Concurrent attempt)
            await expect(service.updateTree(treeId, { status: 'sold' } as any)).rejects.toThrow(
                ConflictException
            );

            expect(repositoryMock.updateTreeWithConcurrencyCheck).toHaveBeenCalledTimes(2);
        });

        it('should handle Promise.allSettled parallel requests where 1 succeeds (200) and 1 is rejected (409)', async () => {
            const treeId = 'tree-456';
            repositoryMock.getTreeDetail.mockResolvedValue({
                id: treeId,
                status: 'available',
            });

            repositoryMock.updateTreeWithConcurrencyCheck
                .mockResolvedValueOnce({ id: treeId, status: 'sold' })
                .mockRejectedValueOnce(
                    new ConflictException('Tree status was updated concurrently by another request')
                );

            const results = await Promise.allSettled([
                service.updateTree(treeId, { status: 'sold' } as any),
                service.updateTree(treeId, { status: 'sold' } as any),
            ]);

            const fulfilled = results.filter((r) => r.status === 'fulfilled');
            const rejected = results.filter((r) => r.status === 'rejected');

            expect(fulfilled).toHaveLength(1);
            expect(rejected).toHaveLength(1);
            expect((rejected[0] as PromiseRejectedResult).reason).toBeInstanceOf(ConflictException);
        });
    });
});
