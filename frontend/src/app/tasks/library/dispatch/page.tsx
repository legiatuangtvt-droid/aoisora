'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useScopeData } from '@/hooks/useScopeData';
import {
  getWsLibraryTemplate,
  dispatchWsLibraryTemplate,
  WsLibraryTemplate,
  WsLibraryDispatchRequest,
} from '@/lib/api';
import { DispatchPageSkeleton } from '@/components/ui/Skeleton';
import { FullPageError, InlineError } from '@/components/ui/ErrorBoundary';

export default function DispatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');

  // Template data
  const [template, setTemplate] = useState<WsLibraryTemplate | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);
  const [templateError, setTemplateError] = useState<string | null>(null);

  // Form state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Scope data
  const {
    regionOptions,
    isLoading: isLoadingScope,
    getZonesByRegion,
    getAreasByZone,
    getStoresByArea,
    getStoresByRegion,
  } = useScopeData();

  // Derived options based on selections
  const zoneOptions = useMemo(() => {
    return selectedRegion ? getZonesByRegion(selectedRegion) : [];
  }, [selectedRegion, getZonesByRegion]);

  const areaOptions = useMemo(() => {
    return selectedZone ? getAreasByZone(selectedZone) : [];
  }, [selectedZone, getAreasByZone]);

  const storeOptions = useMemo(() => {
    if (selectedArea) {
      return getStoresByArea(selectedArea);
    } else if (selectedRegion) {
      return getStoresByRegion(selectedRegion);
    }
    return [];
  }, [selectedArea, selectedRegion, getStoresByArea, getStoresByRegion]);

  // Fetch template on mount
  useEffect(() => {
    if (!templateId) {
      setTemplateError('No template ID provided');
      setIsLoadingTemplate(false);
      return;
    }

    const fetchTemplate = async () => {
      try {
        const data = await getWsLibraryTemplate(Number(templateId));
        setTemplate(data);

        // Check if template can be dispatched
        if (data.status !== 'available' && !data.is_in_active_cooldown) {
          setTemplateError('This template is not available for dispatch');
        }
      } catch (err) {
        console.error('Failed to fetch template:', err);
        setTemplateError(err instanceof Error ? err.message : 'Failed to load template');
      } finally {
        setIsLoadingTemplate(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  // Handle region change
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setSelectedZone('');
    setSelectedArea('');
    setSelectedStores([]);
  };

  // Handle zone change
  const handleZoneChange = (value: string) => {
    setSelectedZone(value);
    setSelectedArea('');
    setSelectedStores([]);
  };

  // Handle area change
  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    setSelectedStores([]);
  };

  // Handle store selection
  const handleStoreToggle = (storeId: string) => {
    setSelectedStores(prev =>
      prev.includes(storeId)
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    );
  };

  // Select/deselect all stores
  const handleSelectAllStores = () => {
    if (selectedStores.length === storeOptions.length) {
      setSelectedStores([]);
    } else {
      setSelectedStores(storeOptions.map(s => s.value));
    }
  };

  // Form validation
  const isFormValid = useMemo(() => {
    return startDate && endDate && selectedStores.length > 0;
  }, [startDate, endDate, selectedStores]);

  // Handle submit
  const handleSubmit = async () => {
    if (!templateId || !isFormValid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const requestData: WsLibraryDispatchRequest = {
        start_date: startDate,
        end_date: endDate,
        store_ids: selectedStores.map(id => Number(id)),
        priority,
        force_override: template?.is_in_active_cooldown ?? false,
      };

      const response = await dispatchWsLibraryTemplate(Number(templateId), requestData);

      // Success - redirect back to library with success message
      router.push('/tasks/library?dispatched=true');
    } catch (err) {
      console.error('Failed to dispatch template:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to dispatch template');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state - Skeleton
  if (isLoadingTemplate || isLoadingScope) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <DispatchPageSkeleton />
      </div>
    );
  }

  // Error state
  if (templateError) {
    return (
      <FullPageError
        title="Error Loading Template"
        message={templateError}
        onGoBack={() => router.push('/tasks/library')}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/tasks/library')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Library
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Dispatch Template</h1>
          <p className="text-gray-500 mt-1">Send this task template to selected stores</p>
        </div>

        {/* Template Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{template?.task_name}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>Type: {template?.taskType?.name || 'N/A'}</span>
            <span>Department: {template?.department?.department_name || 'N/A'}</span>
            <span>Dispatched: {template?.dispatch_count || 0} times</span>
          </div>
          {template?.is_in_active_cooldown && (
            <div className="mt-3 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
              <div className="flex items-center gap-2 text-cyan-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">Cooldown Active</span>
              </div>
              <p className="text-sm text-cyan-700 mt-1">
                This template is in cooldown. Dispatching will force override.
              </p>
            </div>
          )}
        </div>

        {/* Dispatch Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Date Range */}
          <fieldset>
            <legend className="text-sm font-semibold text-gray-900 mb-3">Applicable Period <span className="text-red-500">*</span></legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dispatchStartDate" className="block text-sm text-gray-700 mb-1">Start Date</label>
                <input
                  id="dispatchStartDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  aria-required="true"
                  aria-invalid={!startDate ? 'true' : 'false'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    !startDate ? 'border-gray-300' : 'border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="dispatchEndDate" className="block text-sm text-gray-700 mb-1">End Date</label>
                <input
                  id="dispatchEndDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  aria-required="true"
                  aria-invalid={!endDate ? 'true' : 'false'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    !endDate ? 'border-gray-300' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
          </fieldset>

          {/* Priority */}
          <fieldset>
            <legend className="text-sm font-semibold text-gray-900 mb-3">Priority</legend>
            <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Task priority">
              {(['low', 'normal', 'high', 'urgent'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  role="radio"
                  aria-checked={priority === p}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    priority === p
                      ? p === 'urgent'
                        ? 'bg-red-500 text-white focus:ring-red-500'
                        : p === 'high'
                        ? 'bg-orange-500 text-white focus:ring-orange-500'
                        : p === 'normal'
                        ? 'bg-blue-500 text-white focus:ring-blue-500'
                        : 'bg-gray-500 text-white focus:ring-gray-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-pink-500'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Scope Selection */}
          <fieldset>
            <legend className="text-sm font-semibold text-gray-900 mb-3">Select Stores <span className="text-red-500">*</span></legend>

            {/* Hierarchy filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="dispatchRegion" className="block text-sm text-gray-700 mb-1">Region</label>
                <select
                  id="dispatchRegion"
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  aria-required="true"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select Region</option>
                  {regionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="dispatchZone" className="block text-sm text-gray-700 mb-1">Zone</label>
                <select
                  id="dispatchZone"
                  value={selectedZone}
                  onChange={(e) => handleZoneChange(e.target.value)}
                  disabled={!selectedRegion}
                  aria-disabled={!selectedRegion}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">All Zones</option>
                  {zoneOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="dispatchArea" className="block text-sm text-gray-700 mb-1">Area</label>
                <select
                  id="dispatchArea"
                  value={selectedArea}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  disabled={!selectedZone}
                  aria-disabled={!selectedZone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">All Areas</option>
                  {areaOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Store list */}
            {storeOptions.length > 0 ? (
              <div className={`border rounded-lg ${selectedStores.length === 0 ? 'border-gray-200' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <span className="text-sm text-gray-600" aria-live="polite">
                    {selectedStores.length} of {storeOptions.length} stores selected
                  </span>
                  <button
                    type="button"
                    onClick={handleSelectAllStores}
                    className="text-sm text-pink-600 hover:text-pink-700 focus:outline-none focus:underline"
                  >
                    {selectedStores.length === storeOptions.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div
                  className="max-h-60 overflow-y-auto p-2"
                  role="group"
                  aria-label="Available stores"
                >
                  {storeOptions.map((store) => (
                    <label
                      key={store.value}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStores.includes(store.value)}
                        onChange={() => handleStoreToggle(store.value)}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                        aria-label={`Select ${store.label}`}
                      />
                      <span className="text-sm text-gray-900">{store.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : selectedRegion ? (
              <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg border border-gray-200" role="status">
                No stores found in selected region/zone/area
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg border border-gray-200">
                <p className="flex items-center justify-center gap-1">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Select a region to see available stores
                </p>
              </div>
            )}
            {selectedStores.length === 0 && storeOptions.length > 0 && (
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                At least one store must be selected
              </p>
            )}
          </fieldset>

          {/* Error Message */}
          {submitError && (
            <InlineError message={submitError} />
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => router.push('/tasks/library')}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Dispatching...' : `Dispatch to ${selectedStores.length} Store${selectedStores.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
