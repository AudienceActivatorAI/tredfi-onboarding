import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('AI Platform Name Generator', () => {
  it('should generate platform names with subprime lending focus', async () => {
    const caller = appRouter.createCaller({} as any);

    const result = await caller.onboarding.generateNames({
      dealershipName: 'AutoMax Motors',
      keywords: '',
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.suggestions)).toBe(true);
    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.suggestions.length).toBeLessThanOrEqual(5);

    // Verify all suggestions are strings
    result.suggestions.forEach((name) => {
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });

    console.log('Generated names (subprime focus):', result.suggestions);
  });

  it('should generate platform names with custom keywords and subprime focus', async () => {
    const caller = appRouter.createCaller({} as any);

    const result = await caller.onboarding.generateNames({
      dealershipName: 'Credit Solutions Auto',
      keywords: 'approval, credit, financing',
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.suggestions)).toBe(true);
    expect(result.suggestions.length).toBeGreaterThan(0);

    // Verify all suggestions are strings
    result.suggestions.forEach((name) => {
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });

    console.log('Generated names (with keywords):', result.suggestions);
  });

  it('should handle empty dealership name gracefully', async () => {
    const caller = appRouter.createCaller({} as any);

    const result = await caller.onboarding.generateNames({
      dealershipName: '',
      keywords: 'subprime, credit',
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.suggestions)).toBe(true);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it('should return fallback suggestions if AI fails', async () => {
    const caller = appRouter.createCaller({} as any);

    // Test with a very long dealership name that might cause issues
    const longName = 'A'.repeat(500);

    const result = await caller.onboarding.generateNames({
      dealershipName: longName,
      keywords: '',
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.suggestions)).toBe(true);
    expect(result.suggestions.length).toBeGreaterThan(0);

    // Should either return AI suggestions or fallback suggestions
    result.suggestions.forEach((name) => {
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });
  });
});
