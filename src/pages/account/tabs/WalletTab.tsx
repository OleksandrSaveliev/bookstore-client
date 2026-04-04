import React from "react";
import { Button } from "../../../components/ui/Button/Button";
import { Input } from "../../../components/ui/Input/Input";
import styles from "../Account.module.css";

interface WalletTabProps {
  balance: number;
  topUpAmount: string;
  setTopUpAmount: (val: string) => void;
  handleAddFunds: (e: React.FormEvent) => void;
  loading: boolean;
}

export const WalletTab = ({
  balance,
  topUpAmount,
  setTopUpAmount,
  handleAddFunds,
  loading,
}: WalletTabProps) => (
  <div className={styles.walletSection}>
    <div className={styles.balanceCard}>
      <div className={styles.balanceInfo}>
        <span className={styles.balanceLabel}>Current Balance</span>
        <h2 className={styles.balanceAmount}>${balance.toFixed(2)}</h2>
      </div>
      <div className={styles.walletIcon}>💳</div>
    </div>

    <form
      onSubmit={handleAddFunds}
      className={styles.topUpForm}
    >
      <div className={styles.inputWrapper}>
        <Input
          label="Add Funds to Wallet"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={topUpAmount}
          onChange={(e) => setTopUpAmount(e.target.value)}
          required
        />
      </div>
      <div className={styles.buttonWrapper}>
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !topUpAmount}
        >
          {loading ? "Processing..." : "Add Money"}
        </Button>
      </div>
    </form>
  </div>
);
