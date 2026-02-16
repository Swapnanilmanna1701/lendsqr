import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { User } from "../../types";
import { fetchUserById } from "../../services/api";
import { getUser, saveUser } from "../../utils/indexedDB";
import { saveToLocalStorage } from "../../utils/localStorage";
import "./UserDetails.scss";

const TABS = [
  "General Details",
  "Documents",
  "Bank Details",
  "Loans",
  "Savings",
  "App and System",
] as const;

type Tab = (typeof TABS)[number];

/* ===================================================================== */
/*  Helper – generate a user-code from the id (e.g. "LSQFf587g90")      */
/* ===================================================================== */
function userCode(id: string): string {
  const hash = Array.from(id).reduce(
    (acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0,
    0,
  );
  const hex = Math.abs(hash).toString(36).slice(0, 7);
  return `LSQFf${hex}`;
}

/* ===================================================================== */
/*  Helper – deterministic tier (1-3) from user id                       */
/* ===================================================================== */
function userTier(id: string): number {
  const n = Array.from(id).reduce((a, c) => a + c.charCodeAt(0), 0);
  return (n % 3) + 1;
}

/* ===================================================================== */
/*  Helper – deterministic account number + bank from user id            */
/* ===================================================================== */
function accountInfo(id: string): { balance: string; bank: string } {
  const seed = Array.from(id).reduce(
    (acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0,
    0,
  );
  const abs = Math.abs(seed);
  const balance = ((abs % 900000) + 100000).toLocaleString("en-NG");
  const acctNo = String(abs).padStart(10, "0").slice(0, 10);
  const banks = [
    "Providus Bank",
    "GTBank",
    "Access Bank",
    "First Bank",
    "Zenith Bank",
    "UBA",
    "Kuda Bank",
    "Wema Bank",
  ];
  const bank = banks[abs % banks.length];
  return { balance: `\u20A6${balance}.00`, bank: `${acctNo}/${bank}` };
}

/* ===================================================================== */
/*  Main Component                                                       */
/* ===================================================================== */
const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("General Details");

  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Try IndexedDB cache first
        const cached = await getUser(id);
        if (cached) {
          setUser(cached);
          saveToLocalStorage(`user_${id}`, cached);
          setLoading(false);
          return;
        }

        // 2. Fetch from API
        const fetched = await fetchUserById(id);
        await saveUser(fetched);
        saveToLocalStorage(`user_${id}`, fetched);
        setUser(fetched);
      } catch (err) {
        console.error("Failed to load user:", err);
        setError("Failed to load user details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  /* ------------------------------------------------------------------ */
  /*  Inline SVG icons                                                   */
  /* ------------------------------------------------------------------ */
  const BackArrow = () => (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.94997 15.3564C1.9945 15.4712 2.0613 15.5767 2.14684 15.6658L6.89684 20.4158C7.07263 20.5765 7.30214 20.6644 7.53934 20.6617C7.77654 20.659 8.00409 20.5659 8.17638 20.4013C8.34867 20.2366 8.45276 20.0134 8.46699 19.7766C8.48122 19.5398 8.40453 19.3064 8.25309 19.1221L5.00934 15.9377H27.6562C27.9048 15.9377 28.1431 15.8389 28.3189 15.6632C28.4946 15.4875 28.5934 15.2491 28.5934 15.0005C28.5934 14.752 28.4946 14.5136 28.3189 14.3379C28.1431 14.1622 27.9048 14.0634 27.6562 14.0634H5.00934L8.25309 10.879C8.33973 10.7963 8.40938 10.6974 8.45797 10.5879C8.50656 10.4784 8.53317 10.3605 8.53626 10.2408C8.53935 10.1211 8.51887 10.0019 8.47599 9.89006C8.4331 9.77822 8.36867 9.67588 8.28641 9.5889C8.20415 9.50192 8.10565 9.43186 7.99638 9.38279C7.8871 9.33373 7.76929 9.30661 7.64959 9.30299C7.52989 9.29937 7.41066 9.31934 7.29862 9.36173C7.18658 9.40413 7.08396 9.46811 6.99684 9.54978L2.14684 14.3353C2.06145 14.4244 1.99474 14.5298 1.95028 14.6445C1.90582 14.7593 1.88432 14.8811 1.88684 15.0035C1.88684 15.1236 1.90559 15.2451 1.94997 15.3564Z" fill="#545F7D"/>
    </svg>
  );

  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 0.5L10.163 5.05L15.127 5.587L11.435 9.01L12.398 13.913L8 11.435L3.602 13.913L4.565 9.01L0.873 5.587L5.837 5.05L8 0.5Z"
        fill={filled ? "#E9B200" : "none"}
        stroke="#E9B200"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );

  const AvatarIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 20C23.866 20 27 16.866 27 13C27 9.134 23.866 6 20 6C16.134 6 13 9.134 13 13C13 16.866 16.134 20 20 20Z"
        fill="#213F7D" opacity="0.4"
      />
      <path
        d="M20 23C13.37 23 8 27.03 8 32V34H32V32C32 27.03 26.63 23 20 23Z"
        fill="#213F7D" opacity="0.4"
      />
    </svg>
  );

  /* ------------------------------------------------------------------ */
  /*  Detail field                                                       */
  /* ------------------------------------------------------------------ */
  const DetailField = ({ label, value }: { label: string; value: string | undefined }) => (
    <div className="user-details__field">
      <span className="user-details__field-label">{label}</span>
      <span className="user-details__field-value">{value || "-"}</span>
    </div>
  );

  /* ------------------------------------------------------------------ */
  /*  Loading state                                                      */
  /* ------------------------------------------------------------------ */
  if (loading) {
    return (
      <div className="user-details">
        <div className="user-details__loading">
          <div className="user-details__spinner" />
          <p>Loading user details...</p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Error state                                                        */
  /* ------------------------------------------------------------------ */
  if (error || !user) {
    return (
      <div className="user-details">
        <button className="user-details__back" onClick={() => navigate("/dashboard/users")}>
          <BackArrow />
          <span>Back to Users</span>
        </button>
        <div className="user-details__error">
          <p>{error || "User not found."}</p>
          <button className="user-details__error-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Derived values                                                     */
  /* ------------------------------------------------------------------ */
  const tier = userTier(user.id);
  const code = userCode(user.id);
  const account = accountInfo(user.id);

  const monthlyIncomeDisplay =
    user.educationAndEmployment.monthlyIncome.length === 2
      ? `${user.educationAndEmployment.monthlyIncome[0]} - ${user.educationAndEmployment.monthlyIncome[1]}`
      : user.educationAndEmployment.monthlyIncome.join(", ");

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <div className="user-details">
      {/* ── Back to Users ─────────────────────────────────────────── */}
      <button className="user-details__back" onClick={() => navigate("/dashboard/users")}>
        <BackArrow />
        <span>Back to Users</span>
      </button>

      {/* ── Header row ────────────────────────────────────────────── */}
      <div className="user-details__header">
        <h1 className="user-details__title">User Details</h1>
        <div className="user-details__actions">
          <button className="user-details__btn user-details__btn--blacklist">
            BLACKLIST USER
          </button>
          <button className="user-details__btn user-details__btn--activate">
            ACTIVATE USER
          </button>
        </div>
      </div>

      {/* ── Profile card ──────────────────────────────────────────── */}
      <div className="user-details__profile-card">
        <div className="user-details__profile-top">
          {/* Avatar + Name + ID */}
          <div className="user-details__profile-info">
            <div className="user-details__avatar">
              <AvatarIcon />
            </div>
            <div className="user-details__profile-name-group">
              <h2 className="user-details__profile-name">
                {user.personalInfo.fullName}
              </h2>
              <span className="user-details__profile-id">{code}</span>
            </div>
          </div>

          {/* Divider 1 */}
          <div className="user-details__profile-divider" />

          {/* Tier */}
          <div className="user-details__profile-tier">
            <span className="user-details__profile-tier-label">User's Tier</span>
            <div className="user-details__stars">
              {[1, 2, 3].map((i) => (
                <StarIcon key={i} filled={i <= tier} />
              ))}
            </div>
          </div>

          {/* Divider 2 */}
          <div className="user-details__profile-divider" />

          {/* Account balance */}
          <div className="user-details__profile-balance">
            <span className="user-details__profile-balance-amount">
              {account.balance}
            </span>
            <span className="user-details__profile-balance-bank">
              {account.bank}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <nav className="user-details__tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`user-details__tab ${activeTab === tab ? "user-details__tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* ── General Details content ───────────────────────────────── */}
      {activeTab === "General Details" && (
        <div className="user-details__details-card">
          {/* Personal Information */}
          <section className="user-details__section">
            <h3 className="user-details__section-title">Personal Information</h3>
            <div className="user-details__fields">
              <DetailField label="FULL NAME" value={user.personalInfo.fullName} />
              <DetailField label="PHONE NUMBER" value={user.personalInfo.phoneNumber} />
              <DetailField label="EMAIL ADDRESS" value={user.personalInfo.email} />
              <DetailField label="BVN" value={user.personalInfo.bvn} />
              <DetailField label="GENDER" value={user.personalInfo.gender} />
              <DetailField label="MARITAL STATUS" value={user.personalInfo.maritalStatus} />
              <DetailField label="CHILDREN" value={user.personalInfo.children} />
              <DetailField label="TYPE OF RESIDENCE" value={user.personalInfo.typeOfResidence} />
            </div>
          </section>

          {/* Education and Employment */}
          <section className="user-details__section">
            <h3 className="user-details__section-title">Education and Employment</h3>
            <div className="user-details__fields">
              <DetailField label="LEVEL OF EDUCATION" value={user.educationAndEmployment.levelOfEducation} />
              <DetailField label="EMPLOYMENT STATUS" value={user.educationAndEmployment.employmentStatus} />
              <DetailField label="SECTOR OF EMPLOYMENT" value={user.educationAndEmployment.sectorOfEmployment} />
              <DetailField label="DURATION OF EMPLOYMENT" value={user.educationAndEmployment.durationOfEmployment} />
              <DetailField label="OFFICE EMAIL" value={user.educationAndEmployment.officeEmail} />
              <DetailField label="MONTHLY INCOME" value={monthlyIncomeDisplay} />
              <DetailField label="LOAN REPAYMENT" value={user.educationAndEmployment.loanRepayment} />
            </div>
          </section>

          {/* Socials */}
          <section className="user-details__section">
            <h3 className="user-details__section-title">Socials</h3>
            <div className="user-details__fields">
              <DetailField label="TWITTER" value={user.socials.twitter} />
              <DetailField label="FACEBOOK" value={user.socials.facebook} />
              <DetailField label="INSTAGRAM" value={user.socials.instagram} />
            </div>
          </section>

          {/* Guarantor */}
          <section className="user-details__section user-details__section--last">
            <h3 className="user-details__section-title">Guarantor</h3>
            <div className="user-details__fields">
              <DetailField label="FULL NAME" value={user.guarantor.fullName} />
              <DetailField label="PHONE NUMBER" value={user.guarantor.phoneNumber} />
              <DetailField label="EMAIL ADDRESS" value={user.guarantor.email} />
              <DetailField label="RELATIONSHIP" value={user.guarantor.relationship} />
            </div>
          </section>
        </div>
      )}

      {/* ── Placeholder for other tabs ────────────────────────────── */}
      {activeTab !== "General Details" && (
        <div className="user-details__details-card">
          <div className="user-details__tab-placeholder">
            <p>{activeTab} content will be displayed here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
