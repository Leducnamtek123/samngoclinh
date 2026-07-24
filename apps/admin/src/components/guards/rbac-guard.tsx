'use client';

import React from 'react';
import { useRole, UserRole } from '@/hooks/use-role';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/providers/i18n-provider';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
  showErrorNotice?: boolean;
}

export function RoleGuard({
  children,
  allowedRoles = ['SUPER_ADMIN', 'ADMIN'],
  fallback = null,
  showErrorNotice = true,
}: RoleGuardProps) {
  const { hasRole, isLoading } = useRole();
  const { t } = useTranslation();

  if (isLoading) {
    return <div className="p-4 text-center text-sm text-muted-foreground">{t("common.status.pending")}</div>;
  }

  if (!hasRole(allowedRoles)) {
    if (fallback) return <>{fallback}</>;
    
    if (!showErrorNotice) return null;

    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-destructive/10 text-destructive my-4">
        <ShieldAlert className="w-12 h-12 mb-2" />
        <h3 className="font-semibold text-lg">{t("navigation.unauthorized401")} (403 Forbidden)</h3>
        <p className="text-sm text-muted-foreground mt-1 text-center">
          {t("messages.errorOccurred")}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
