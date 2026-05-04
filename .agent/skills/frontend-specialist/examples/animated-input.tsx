/**
 * Animated Input — Floating label + underline + focus glow + error shake
 */

import { AnimatePresence, motion } from 'framer-motion';
import { type ComponentPropsWithoutRef, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedInputProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'placeholder'> {
  label: string;
  error?: string;
  helperText?: string;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  (
    { label, error, helperText, className, value, onFocus, onBlur, ...props },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== '';
    const isFloating = isFocused || hasValue;

    return (
      <motion.div
        animate={error ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={cn('relative', className)}
      >
        {/* Input */}
        <input
          ref={ref}
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            'peer w-full border-b-2 bg-transparent px-0 pt-5 pb-2 text-sm',
            'outline-none transition-colors',
            error
              ? 'border-destructive'
              : isFocused
                ? 'border-primary'
                : 'border-border',
          )}
          {...props}
        />

        {/* Floating Label */}
        <motion.label
          animate={{
            y: isFloating ? 0 : 12,
            scale: isFloating ? 0.75 : 1,
            color: error
              ? 'hsl(var(--destructive))'
              : isFocused
                ? 'hsl(var(--primary))'
                : 'hsl(var(--muted-foreground))',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="pointer-events-none absolute top-0 left-0 origin-left text-sm"
        >
          {label}
        </motion.label>

        {/* Animated Underline (focus indicator) */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: isFocused ? '100%' : '0%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        {/* Error / Helper Text */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-1.5 text-destructive text-xs"
            >
              {error}
            </motion.p>
          )}
          {!error && helperText && (
            <motion.p
              key="helper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1.5 text-muted-foreground text-xs"
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);
AnimatedInput.displayName = 'AnimatedInput';
