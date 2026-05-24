import { describe, it, expect } from 'vitest';
import { DEFAULT_BRAND, buildBrand, getNannyBrand, getBrandCssVars } from '~/lib/nanny/brand';

describe('brand', () => {
  it('DEFAULT_BRAND has required fields', () => {
    expect(DEFAULT_BRAND.name).toBe('Nanny');
    expect(DEFAULT_BRAND.avatar).toBe('/chef.svg');
    expect(DEFAULT_BRAND.cuisineFocus.length).toBeGreaterThan(0);
    expect(DEFAULT_BRAND.ctaCopy.primary).toBeTruthy();
    expect(DEFAULT_BRAND.ctaCopy.secondary.length).toBeGreaterThan(0);
  });

  it('buildBrand merges overrides with defaults', () => {
    const custom = buildBrand({ name: 'Test Kitchen', primaryColor: '#FF0000' });
    expect(custom.name).toBe('Test Kitchen');
    expect(custom.primaryColor).toBe('#FF0000');
    expect(custom.avatar).toBe('/chef.svg');
  });

  it('getNannyBrand returns DEFAULT_BRAND when no env set', () => {
    const brand = getNannyBrand(undefined);
    expect(brand.name).toBe('Nanny');
  });

  it('getNannyBrand parses valid JSON override', () => {
    const json = JSON.stringify({ name: 'Ase Kitchen' });
    const brand = getNannyBrand(json);
    expect(brand.name).toBe('Ase Kitchen');
    expect(brand.avatar).toBe('/chef.svg');
  });

  it('getNannyBrand falls back to default on invalid JSON', () => {
    const brand = getNannyBrand('not-json');
    expect(brand.name).toBe('Nanny');
  });

  it('getBrandCssVars returns correct CSS variables', () => {
    const vars = getBrandCssVars(DEFAULT_BRAND);
    expect(vars['--nanny-primary']).toBe(DEFAULT_BRAND.primaryColor);
    expect(vars['--nanny-secondary']).toBe(DEFAULT_BRAND.secondaryColor);
    expect(vars['--nanny-bg']).toBe(DEFAULT_BRAND.backgroundColor);
  });

  it('brand contains no secrets', () => {
    const brandStr = JSON.stringify(DEFAULT_BRAND);
    expect(brandStr).not.toContain('sk-');
    expect(brandStr).not.toContain('API_KEY');
    expect(brandStr).not.toContain('process.env');
  });
});
