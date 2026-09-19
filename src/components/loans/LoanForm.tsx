"use client";

import { Alert, Button, Form, Input, InputNumber, Select } from "antd";
import type { Rule } from "antd/es/form";
import { useMemo, useState } from "react";

import { formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n/I18nProvider";
import {
  MAX_INTEREST_RATE,
  MAX_LOAN_AMOUNT,
  MIN_LOAN_AMOUNT,
  PHONE_PATTERN,
  TERM_OPTIONS,
} from "@/lib/loanRules";
import { LOAN_TYPES, type CreateLoanInput } from "@/types/loan";

interface LoanFormProps {
  /** Should reject on failure; the form then shows an inline error and stays open. */
  onSubmit: (input: CreateLoanInput) => Promise<void>;
  onCancel: () => void;
}

type FormValues = CreateLoanInput;

const groupThousands = (value: number | string | undefined) =>
  value === undefined || value === "" ? "" : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h3 className="mb-4 text-body font-semibold text-fg">{title}</h3>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function LoanForm({ onSubmit, onCancel }: LoanFormProps) {
  const { t } = useI18n();
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);

  const rules = useMemo(() => {
    const required: Rule = { required: true, message: t("validation.required") };

    const amount: Rule = {
      validator: (_, value: number | null | undefined) => {
        if (value === undefined || value === null) return Promise.resolve(); // `required` reports this
        if (value <= 0) return Promise.reject(new Error(t("validation.amountPositive")));
        if (value < MIN_LOAN_AMOUNT) {
          return Promise.reject(new Error(t("validation.amountMin", { min: formatNumber(MIN_LOAN_AMOUNT) })));
        }
        if (value > MAX_LOAN_AMOUNT) {
          return Promise.reject(new Error(t("validation.amountMax", { max: formatNumber(MAX_LOAN_AMOUNT) })));
        }
        return Promise.resolve();
      },
    };

    const rate: Rule = {
      validator: (_, value: number | null | undefined) =>
        value !== undefined && value !== null && (value <= 0 || value > MAX_INTEREST_RATE)
          ? Promise.reject(new Error(t("validation.rate")))
          : Promise.resolve(),
    };

    return {
      name: [required, { min: 2, message: t("validation.name") }],
      phone: [required, { pattern: PHONE_PATTERN, message: t("validation.phone") }],
      email: [required, { type: "email", message: t("validation.email") } as Rule],
      required: [required],
      amount: [required, amount],
      rate: [required, rate],
    };
  }, [t]);

  const handleFinish = async (values: FormValues) => {
    setSubmitting(true);
    setFailed(false);
    try {
      await onSubmit(values);
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      requiredMark="optional"
      disabled={submitting}
      scrollToFirstError
      onFinish={handleFinish}
      initialValues={{ interestRate: 18.5 }}
    >
      <FormSection title={t("form.section.customer")}>
        <Form.Item name="customerName" label={t("form.customerName")} rules={rules.name} className="sm:col-span-2">
          <Input placeholder={t("form.placeholder.name")} autoComplete="off" />
        </Form.Item>
        <Form.Item name="phone" label={t("form.phone")} rules={rules.phone}>
          <Input prefix="+976" placeholder="9911 2345" inputMode="tel" autoComplete="off" />
        </Form.Item>
        <Form.Item name="email" label={t("form.email")} rules={rules.email}>
          <Input placeholder="name@example.com" inputMode="email" autoComplete="off" />
        </Form.Item>
      </FormSection>

      <FormSection title={t("form.section.loan")}>
        <Form.Item name="type" label={t("form.type")} rules={rules.required}>
          <Select
            placeholder={t("form.placeholder.type")}
            options={LOAN_TYPES.map((type) => ({ value: type, label: t(`loanType.${type}`) }))}
          />
        </Form.Item>
        <Form.Item name="term" label={t("form.term")} rules={rules.required}>
          <Select
            placeholder={t("form.placeholder.term")}
            options={TERM_OPTIONS.map((months) => ({ value: months, label: t("unit.months", { count: months }) }))}
          />
        </Form.Item>
        <Form.Item name="amount" label={t("form.amount")} rules={rules.amount}>
          <InputNumber<number>
            className="w-full"
            prefix="₮"
            precision={0}
            placeholder="8,500,000"
            formatter={groupThousands}
            parser={(value) => (value ?? "").replace(/,/g, "") as unknown as number}
            inputMode="numeric"
          />
        </Form.Item>
        <Form.Item name="interestRate" label={t("form.interestRate")} rules={rules.rate}>
          <InputNumber<number> className="w-full" suffix="%" step={0.1} precision={1} inputMode="decimal" />
        </Form.Item>
        <Form.Item name="purpose" label={t("form.purpose")} className="sm:col-span-2">
          <Input.TextArea rows={3} maxLength={200} showCount placeholder={t("form.placeholder.purpose")} />
        </Form.Item>
      </FormSection>

      {failed && <Alert type="error" showIcon title={t("form.submitError")} className="mb-4" />}

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button onClick={onCancel} disabled={submitting}>
          {t("form.cancel")}
        </Button>
        <Button type="primary" htmlType="submit" loading={submitting}>
          {t("form.submit")}
        </Button>
      </div>
    </Form>
  );
}
