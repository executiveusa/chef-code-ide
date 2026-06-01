import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';

export interface OnboardingData {
  kitchenName: string;
  restaurantType: string;
  cuisineFocus: string[];
  teamSize: string;
  firstEventDate: string;
}

export interface NannyOnboardingProps {
  sessionId: string;
  onComplete: (data: OnboardingData) => void;
}

const TOTAL_STEPS = 5;

const RESTAURANT_TYPES = [
  { value: 'ghost-kitchen', label: 'Ghost Kitchen' },
  { value: 'private-chef', label: 'Private Chef' },
  { value: 'catering', label: 'Catering' },
  { value: 'pop-up', label: 'Pop-Up' },
  { value: 'estate', label: 'Estate' },
] as const;

const CUISINE_OPTIONS = [
  'West African',
  'Caribbean',
  'Southern Soul',
  'Afro-Brazilian',
  'Ethiopian',
  'Creole',
  'Jamaican',
  'Nigerian',
  'Ghanaian',
  'Haitian',
] as const;

const TEAM_SIZES = [
  { value: 'just-me', label: 'Just me' },
  { value: '2-5', label: '2–5' },
  { value: '6-15', label: '6–15' },
  { value: '16+', label: '16+' },
] as const;

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  return (
    <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-[#2D5016]/10">
      <div
        className="h-full rounded-full bg-[#2D5016] transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
        aria-valuenow={step}
        aria-valuemax={TOTAL_STEPS}
        role="progressbar"
      />
    </div>
  );
}

function StepLabel({ step }: { step: number }) {
  return (
    <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#1A1A18]/40">
      Step {step} of {TOTAL_STEPS}
    </p>
  );
}

function PrimaryButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-6 w-full rounded-2xl bg-[#2D5016] py-4 text-base font-semibold tracking-wide text-white outline-none transition-opacity duration-150 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#7CB342] active:opacity-80 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function RadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  value: T | '';
  onChange: (v: T) => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`w-full rounded-2xl border px-5 py-4 text-left text-sm font-medium outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#7CB342] ${
            value === opt.value
              ? 'border-[#2D5016] bg-[#2D5016] text-white'
              : 'border-[#2D5016]/20 bg-white text-[#1A1A18] hover:border-[#2D5016]/50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ChipGroup({
  options,
  selected,
  onChange,
}: {
  options: readonly string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((s) => s !== item));
    } else {
      onChange([...selected, item]);
    }
  };
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`rounded-full border px-4 py-2 text-sm font-medium outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#7CB342] ${
            selected.includes(opt)
              ? 'border-[#2D5016] bg-[#2D5016] text-white'
              : 'border-[#2D5016]/20 bg-white text-[#1A1A18] hover:border-[#2D5016]/50'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function NannyOnboarding({ sessionId, onComplete }: NannyOnboardingProps) {
  const [step, setStep] = useState(1);
  const [visible, setVisible] = useState(true);
  const [kitchenName, setKitchenName] = useState('');
  const [restaurantType, setRestaurantType] = useState<string>('');
  const [cuisineFocus, setCuisineFocus] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState<string>('');
  const [firstEventDate, setFirstEventDate] = useState('');
  const [_location, setLocation] = useState('');

  const updateOnboarding = useMutation(api.nannyOrgs.updateOnboarding);

  const saveStep = async (nextStep: number, completed = false) => {
    await updateOnboarding({
      sessionId,
      step: nextStep,
      kitchenName: kitchenName || undefined,
      restaurantType: restaurantType || undefined,
      cuisineFocus: cuisineFocus.length > 0 ? cuisineFocus : undefined,
      teamSize: teamSize || undefined,
      firstEventDate: firstEventDate || undefined,
      completed,
    });
  };

  const transitionTo = (nextStep: number, completed = false) => {
    setVisible(false);
    saveStep(nextStep, completed).catch(console.error);
    setTimeout(() => {
      setStep(nextStep);
      setVisible(true);
    }, 200);
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      transitionTo(step + 1);
    }
  };

  const handleComplete = () => {
    const data: OnboardingData = {
      kitchenName,
      restaurantType,
      cuisineFocus,
      teamSize,
      firstEventDate,
    };
    transitionTo(5, true);
    onComplete(data);
  };

  // Step 1 validation
  const step1Valid = kitchenName.trim().length > 0 && restaurantType !== '';
  const step2Valid = cuisineFocus.length >= 1;
  const step3Valid = teamSize !== '';
  const step4Valid = firstEventDate !== '';

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10" style={{ background: '#FAFAF7' }}>
      <div className="w-full max-w-md">
        <ProgressBar step={step} />

        <div className="transition-opacity duration-200" style={{ opacity: visible ? 1 : 0 }}>
          {step === 1 && (
            <Step1
              kitchenName={kitchenName}
              onKitchenNameChange={setKitchenName}
              restaurantType={restaurantType}
              onRestaurantTypeChange={setRestaurantType}
              onNext={handleNext}
              isValid={step1Valid}
            />
          )}
          {step === 2 && (
            <Step2
              cuisineFocus={cuisineFocus}
              onCuisineFocusChange={setCuisineFocus}
              onNext={handleNext}
              isValid={step2Valid}
            />
          )}
          {step === 3 && (
            <Step3 teamSize={teamSize} onTeamSizeChange={setTeamSize} onNext={handleNext} isValid={step3Valid} />
          )}
          {step === 4 && (
            <Step4
              firstEventDate={firstEventDate}
              onFirstEventDateChange={setFirstEventDate}
              onLocationChange={setLocation}
              onNext={handleComplete}
              isValid={step4Valid}
            />
          )}
          {step === 5 && <Step5 kitchenName={kitchenName} cuisineFocus={cuisineFocus} />}
        </div>
      </div>
    </div>
  );
}

// ─── Step sub-components ─────────────────────────────────────────────────────

function Step1({
  kitchenName,
  onKitchenNameChange,
  restaurantType,
  onRestaurantTypeChange,
  onNext,
  isValid,
}: {
  kitchenName: string;
  onKitchenNameChange: (v: string) => void;
  restaurantType: string;
  onRestaurantTypeChange: (v: string) => void;
  onNext: () => void;
  isValid: boolean;
}) {
  return (
    <div>
      <StepLabel step={1} />
      <h1 className="mb-1 text-2xl font-bold text-[#1A1A18]">Kitchen Identity</h1>
      <p className="mb-6 text-sm text-[#1A1A18]/60">{"Let's set the stage for your operation."}</p>

      <label className="mb-2 block text-sm font-semibold text-[#1A1A18]">{"What's your kitchen called?"}</label>
      <input
        type="text"
        value={kitchenName}
        onChange={(e) => onKitchenNameChange(e.target.value)}
        placeholder="e.g. Soro Soke Kitchen"
        className="w-full rounded-2xl border border-[#2D5016]/20 bg-white px-4 py-3 text-base text-[#1A1A18] placeholder-[#1A1A18]/30 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[#7CB342]"
      />

      <label className="mb-1 mt-6 block text-sm font-semibold text-[#1A1A18]">What type of operation?</label>
      <RadioGroup
        options={RESTAURANT_TYPES}
        value={restaurantType as (typeof RESTAURANT_TYPES)[number]['value'] | ''}
        onChange={onRestaurantTypeChange}
      />

      <PrimaryButton onClick={onNext} disabled={!isValid}>
        Next →
      </PrimaryButton>
    </div>
  );
}

function Step2({
  cuisineFocus,
  onCuisineFocusChange,
  onNext,
  isValid,
}: {
  cuisineFocus: string[];
  onCuisineFocusChange: (v: string[]) => void;
  onNext: () => void;
  isValid: boolean;
}) {
  return (
    <div>
      <StepLabel step={2} />
      <h1 className="mb-1 text-2xl font-bold text-[#1A1A18]">Cuisine Focus</h1>
      <p className="mb-6 text-sm text-[#1A1A18]/60">Which cuisines do you celebrate? Select all that apply.</p>

      <ChipGroup options={CUISINE_OPTIONS} selected={cuisineFocus} onChange={onCuisineFocusChange} />

      <PrimaryButton onClick={onNext} disabled={!isValid}>
        Next →
      </PrimaryButton>
    </div>
  );
}

function Step3({
  teamSize,
  onTeamSizeChange,
  onNext,
  isValid,
}: {
  teamSize: string;
  onTeamSizeChange: (v: string) => void;
  onNext: () => void;
  isValid: boolean;
}) {
  return (
    <div>
      <StepLabel step={3} />
      <h1 className="mb-1 text-2xl font-bold text-[#1A1A18]">Your Team</h1>
      <p className="mb-2 text-sm text-[#1A1A18]/60">How many people run service?</p>

      <RadioGroup
        options={TEAM_SIZES}
        value={teamSize as (typeof TEAM_SIZES)[number]['value'] | ''}
        onChange={onTeamSizeChange}
      />

      <PrimaryButton onClick={onNext} disabled={!isValid}>
        Next →
      </PrimaryButton>
    </div>
  );
}

function Step4({
  firstEventDate,
  onFirstEventDateChange,
  onLocationChange,
  onNext,
  isValid,
}: {
  firstEventDate: string;
  onFirstEventDateChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onNext: () => void;
  isValid: boolean;
}) {
  return (
    <div>
      <StepLabel step={4} />
      <h1 className="mb-1 text-2xl font-bold text-[#1A1A18]">First Event</h1>
      <p className="mb-6 text-sm text-[#1A1A18]/60">Tell us about your next event.</p>

      <label className="mb-2 block text-sm font-semibold text-[#1A1A18]">{"When's your next event?"}</label>
      <input
        type="date"
        value={firstEventDate}
        onChange={(e) => onFirstEventDateChange(e.target.value)}
        className="w-full rounded-2xl border border-[#2D5016]/20 bg-white px-4 py-3 text-base text-[#1A1A18] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[#7CB342]"
      />

      <label className="mb-2 mt-5 block text-sm font-semibold text-[#1A1A18]">Where?</label>
      <input
        type="text"
        onChange={(e) => onLocationChange(e.target.value)}
        placeholder="e.g. Brooklyn, NY"
        className="w-full rounded-2xl border border-[#2D5016]/20 bg-white px-4 py-3 text-base text-[#1A1A18] placeholder-[#1A1A18]/30 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[#7CB342]"
      />

      <PrimaryButton onClick={onNext} disabled={!isValid}>
        Generate My First Menu →
      </PrimaryButton>
    </div>
  );
}

function Step5({ kitchenName, cuisineFocus }: { kitchenName: string; cuisineFocus: string[] }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="text-center">
      <div
        className="transition-all duration-700 ease-out"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(16px)',
        }}
      >
        {/* Brand avatar */}
        <div className="mb-8 flex justify-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-[#2D5016]/10">
            <img
              src="/chef.svg"
              alt="Chef"
              width={56}
              height={56}
              className="object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-bold text-[#1A1A18]">Your kitchen is ready.</h1>

        {kitchenName && <p className="mb-4 text-lg font-semibold text-[#2D5016]">{kitchenName}</p>}

        {cuisineFocus.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {cuisineFocus.map((c) => (
              <span key={c} className="rounded-full bg-[#2D5016] px-3 py-1 text-sm font-medium text-white">
                {c}
              </span>
            ))}
          </div>
        )}

        <a
          href="/nanny"
          className="block w-full rounded-2xl bg-[#2D5016] py-4 text-center text-base font-semibold tracking-wide text-white outline-none transition-opacity duration-150 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#7CB342] active:opacity-80"
        >
          Open My Kitchen →
        </a>
      </div>
    </div>
  );
}
