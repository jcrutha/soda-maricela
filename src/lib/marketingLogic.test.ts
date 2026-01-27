import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { determinePopupState } from './marketingLogic';

describe('Marketing Popup Logic', () => {
    
    // Helper to create date for specific day
    // 2026-01-20 is a Tuesday
    // 2026-01-21 is a Wednesday
    const tuesday = new Date('2026-01-20T10:00:00Z');
    const wednesday = new Date('2026-01-21T10:00:00Z');

    beforeEach(() => {
        // DEFAULT: Run tests in the FUTURE (2027) so the Dev Mode override (Jan 2026) is expired.
        // This ensures we are testing the permanent business logic.
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2027-01-01T00:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should show Standard mode for US user on Wednesday', () => {
        const result = determinePopupState({
            date: wednesday,
            timezone: 'America/New_York',
            locale: 'en-US'
        });
        expect(result.shouldShow).toBe(true);
        expect(result.mode).toBe('standard');
    });

    it('should show Tuesday Closed mode for US user on Tuesday', () => {
        const result = determinePopupState({
            date: tuesday,
            timezone: 'America/New_York',
            locale: 'en-US'
        });
        expect(result.shouldShow).toBe(true);
        expect(result.mode).toBe('tuesday_closed');
    });

    it('should HIDE for Costa Rican user speaking Spanish', () => {
        const result = determinePopupState({
            date: wednesday,
            timezone: 'America/Costa_Rica',
            locale: 'es-CR'
        });
        expect(result.shouldShow).toBe(false);
        expect(result.mode).toBe('hidden');
    });

    it('should SHOW for Costa Rican user speaking English (Gringo in CR)', () => {
        const result = determinePopupState({
            date: wednesday,
            timezone: 'America/Costa_Rica',
            locale: 'en-US'
        });
        expect(result.shouldShow).toBe(true);
        expect(result.mode).toBe('standard');
    });
    
    it('should SHOW Tuesday mode for Gringo in CR on Tuesday', () => {
         const result = determinePopupState({
            date: tuesday,
            timezone: 'America/Costa_Rica',
            locale: 'en-US'
        });
        expect(result.shouldShow).toBe(true);
        expect(result.mode).toBe('tuesday_closed');
    });

    it('should HIDE for CR Spanish user even on Tuesday', () => {
         const result = determinePopupState({
            date: tuesday,
            timezone: 'America/Costa_Rica',
            locale: 'es-CR'
        });
        expect(result.shouldShow).toBe(false);
        expect(result.mode).toBe('hidden');
    });

    // --- DEV MODE TESTS ---

    it('DEV MODE: should SHOW for CR/Spanish user if within override window (Jan 21 2026)', () => {
        // Set time to specific override window
        // Override expires 2026-01-21T12:00:00Z
        // We test at 11:00:00Z
        vi.setSystemTime(new Date('2026-01-21T11:00:00Z'));
        
        const result = determinePopupState({
            date: wednesday,
            timezone: 'America/Costa_Rica',
            locale: 'es-CR'
        });
        
        // normally FALSE, but TRUE due to override
        expect(result.shouldShow).toBe(true);
        expect(result.mode).toBe('standard');
    });
});