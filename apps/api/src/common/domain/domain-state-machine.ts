import { BadRequestException } from '@nestjs/common';

export const TREE_TRANSITIONS: Record<string, string[]> = {
    planted: ['growing', 'available', 'harvested', 'planted'],
    growing: ['available', 'harvested', 'growing'],
    available: ['harvested', 'sold', 'available'],
    harvested: ['sold', 'harvested'],
    sold: ['sold'],
    active: ['active', 'harvested', 'growing', 'available', 'sold'],
};

export const ORDER_TRANSITIONS: Record<string, string[]> = {
    pending: ['processing', 'paid', 'cancelled', 'pending'],
    processing: ['paid', 'shipping', 'cancelled', 'processing'],
    paid: ['shipping', 'completed', 'cancelled', 'paid'],
    shipping: ['completed', 'cancelled', 'shipping'],
    completed: ['completed'],
    cancelled: ['cancelled'],
};

export function validateStateTransition(
    domain: 'Tree' | 'Order',
    currentStatus: string,
    targetStatus: string
): void {
    const transitions = domain === 'Tree' ? TREE_TRANSITIONS : ORDER_TRANSITIONS;
    const current = (currentStatus || '').toLowerCase().trim();
    const target = (targetStatus || '').toLowerCase().trim();

    if (!current || !target || current === target) {
        return;
    }

    const allowed = transitions[current];
    if (allowed && !allowed.includes(target)) {
        throw new BadRequestException(
            `Invalid ${domain} status transition from '${currentStatus}' to '${targetStatus}'`
        );
    }
}
