'use client';

import React, { useCallback } from 'react';
import { useIdleTimer } from '@/contexts/IdleTimerContext';
import { SessionWarningModal } from './SessionWarningModal';
import { useAuth } from '@/contexts/AuthContext';

/**
 * SessionWarningWrapper
 *
 * Wrapper component that connects IdleTimerContext with SessionWarningModal
 * Handles logout action when user clicks "Log Out" button
 */
const SessionWarningWrapper: React.FC = () => {
  const { showWarning, timeRemaining, extendSession } = useIdleTimer();
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <SessionWarningModal
      isOpen={showWarning}
      timeRemaining={timeRemaining}
      onStayLoggedIn={extendSession}
      onLogOut={handleLogout}
    />
  );
};

export default SessionWarningWrapper;
