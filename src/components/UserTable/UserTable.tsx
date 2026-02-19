import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import type { User, UserStatus, FilterValues } from "../../types";
import "./UserTable.scss";

/* ───────────── Inline SVG Icons ───────────── */

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.22222 13.3333H9.77778V11.5556H6.22222V13.3333ZM0 2.66667V4.44444H16V2.66667H0ZM2.66667 8.88889H13.3333V7.11111H2.66667V8.88889Z"
      fill="#545F7D"
    />
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="4" r="1.5" fill="#545F7D" />
    <circle cx="10" cy="10" r="1.5" fill="#545F7D" />
    <circle cx="10" cy="16" r="1.5" fill="#545F7D" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 3C4.36364 3 1.25818 5.28067 0 8.5C1.25818 11.7193 4.36364 14 8 14C11.6364 14 14.7418 11.7193 16 8.5C14.7418 5.28067 11.6364 3 8 3ZM8 12.1667C5.97455 12.1667 4.33333 10.5253 4.33333 8.5C4.33333 6.47467 5.97455 4.83333 8 4.83333C10.0255 4.83333 11.6667 6.47467 11.6667 8.5C11.6667 10.5253 10.0255 12.1667 8 12.1667ZM8 6.3C6.78182 6.3 5.8 7.28133 5.8 8.5C5.8 9.71867 6.78182 10.7 8 10.7C9.21818 10.7 10.2 9.71867 10.2 8.5C10.2 7.28133 9.21818 6.3 8 6.3Z"
      fill="#545F7D"
    />
  </svg>
);

const UserXIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z"
      fill="#545F7D"
    />
    <line x1="12" y1="4" x2="16" y2="8" stroke="#E4033B" strokeWidth="1.5" />
    <line x1="16" y1="4" x2="12" y2="8" stroke="#E4033B" strokeWidth="1.5" />
  </svg>
);

const UserCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z"
      fill="#545F7D"
    />
    <path d="M12 5L13.5 6.5L16 3.5" stroke="#39CD62" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3L5 7L9 11" stroke="#213F7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3L9 7L5 11" stroke="#213F7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ───────────── Helpers ───────────── */

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const statusClassMap: Record<UserStatus, string> = {
  Active: "active",
  Inactive: "inactive",
  Pending: "pending",
  Blacklisted: "blacklisted",
};

/* ───────────── Select Chevron Icon ───────────── */

const SelectChevron = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#213F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ───────────── Filter Popup ───────────── */

interface FilterPopupProps {
  organizations: string[];
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
  onReset: () => void;
  onClose: () => void;
}

const FilterPopup: React.FC<FilterPopupProps> = ({
  organizations,
  filters,
  onChange,
  onReset,
  onClose,
}) => {
  const [local, setLocal] = useState<FilterValues>({ ...filters });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChange = (field: keyof FilterValues, value: string) => {
    setLocal((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(local);
    onClose();
  };

  const handleReset = () => {
    const empty: FilterValues = {};
    setLocal(empty);
    onReset();
    onClose();
  };

  return (
    <div className="user-table__filter-popup" ref={ref}>
      <form onSubmit={handleSubmit}>
        <div className="user-table__filter-grid">
          <div className="user-table__filter-field">
            <label>Organization</label>
            <div className="user-table__filter-select-wrapper">
              <select
                value={local.organization || ""}
                onChange={(e) => handleChange("organization", e.target.value)}
              >
                <option value="">Select</option>
                {organizations.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
              <span className="user-table__filter-select-icon">
                <SelectChevron />
              </span>
            </div>
          </div>

          <div className="user-table__filter-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="User"
              value={local.username || ""}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </div>

          <div className="user-table__filter-field">
            <label>Email</label>
            <input
              type="text"
              placeholder="Email"
              value={local.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="user-table__filter-field">
            <label>Date</label>
            <input
              type="date"
              placeholder="Date"
              value={local.date || ""}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          <div className="user-table__filter-field">
            <label>Phone Number</label>
            <input
              type="text"
              placeholder="Phone Number"
              value={local.phoneNumber || ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />
          </div>

          <div className="user-table__filter-field">
            <label>Status</label>
            <div className="user-table__filter-select-wrapper">
              <select
                value={local.status || ""}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="">Select</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Blacklisted">Blacklisted</option>
              </select>
              <span className="user-table__filter-select-icon">
                <SelectChevron />
              </span>
            </div>
          </div>
        </div>

        <div className="user-table__filter-actions">
          <button type="button" className="user-table__filter-reset" onClick={handleReset}>
            Reset
          </button>
          <button type="submit" className="user-table__filter-apply">
            Filter
          </button>
        </div>
      </form>
    </div>
  );
};

/* ───────────── Main Component ───────────── */

interface UserTableProps {
  users: User[];
  loading: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, loading }) => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<FilterValues>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const menuRef = useRef<HTMLDivElement>(null);
  const moreBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Close action menu on outside click or scroll
  useEffect(() => {
    if (!activeMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Ignore clicks on the menu itself or on any more-button
      if (menuRef.current && menuRef.current.contains(target)) return;
      if (moreBtnRefs.current[activeMenu]?.contains(target)) return;
      setActiveMenu(null);
    };

    const handleScroll = () => setActiveMenu(null);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [activeMenu]);

  // Unique organizations for filter dropdown
  const organizations = useMemo(
    () => [...new Set(users.map((u) => u.orgName))].sort(),
    [users]
  );

  // Apply filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (filters.organization && user.orgName !== filters.organization) return false;
      if (filters.username && !user.userName.toLowerCase().includes(filters.username.toLowerCase()))
        return false;
      if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase()))
        return false;
      if (filters.phoneNumber && !user.phoneNumber.includes(filters.phoneNumber)) return false;
      if (filters.status && user.status !== filters.status) return false;
      if (filters.date) {
        const filterDate = new Date(filters.date).toDateString();
        const userDate = new Date(user.createdAt).toDateString();
        if (filterDate !== userDate) return false;
      }
      return true;
    });
  }, [users, filters]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

  // Reset to page 1 when filters or itemsPerPage change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters({});
  }, []);

  const toggleMenu = (userId: string) => {
    if (activeMenu === userId) {
      setActiveMenu(null);
      return;
    }

    // Calculate position in viewport coords (portal renders at body level)
    const btn = moreBtnRefs.current[userId];
    if (btn) {
      const btnRect = btn.getBoundingClientRect();
      setMenuPosition({
        top: btnRect.bottom + window.scrollY + 4,
        left: btnRect.right + window.scrollX - 180, // 180 = menu min-width
      });
    }

    setActiveMenu(userId);
  };

  const handleViewDetails = (userId: string) => {
    setActiveMenu(null);
    navigate(`/dashboard/users/${userId}`);
  };

  // Generate page numbers for pagination
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="user-table">
        <div className="user-table__loading">
          <div className="user-table__spinner" />
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  const startItem = filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredUsers.length);

  return (
    <div className="user-table">
      {/* Mobile filter button */}
      <div className="user-table__mobile-filter-bar">
        <button
          className="user-table__mobile-filter-toggle"
          type="button"
          onClick={() => setFilterOpen((prev) => !prev)}
        >
          <FilterIcon />
          <span>Filter</span>
        </button>
      </div>

      {/* Filter popup – rendered outside the table wrapper for mobile */}
      <div className="user-table__filter-container">
        {filterOpen && (
          <FilterPopup
            organizations={organizations}
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
            onClose={() => setFilterOpen(false)}
          />
        )}
      </div>

      {/* Desktop table view */}
      <div className="user-table__wrapper">
        <table className="user-table__table">
          <thead>
            <tr>
              {["ORGANIZATION", "USERNAME", "EMAIL", "PHONE NUMBER", "DATE JOINED", "STATUS"].map(
                (header) => (
                  <th key={header}>
                    <span className="user-table__header-content">
                      {header}
                      <button
                        className="user-table__filter-btn"
                        type="button"
                        onClick={() => setFilterOpen((prev) => !prev)}
                        aria-label={`Filter by ${header}`}
                      >
                        <FilterIcon />
                      </button>
                    </span>
                  </th>
                )
              )}
              <th className="user-table__th-actions" />
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="user-table__empty">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.orgName}</td>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <span className={`user-table__status user-table__status--${statusClassMap[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="user-table__td-actions">
                    <button
                      className="user-table__more-btn"
                      type="button"
                      ref={(el) => { moreBtnRefs.current[user.id] = el; }}
                      onClick={() => toggleMenu(user.id)}
                      aria-label="More actions"
                    >
                      <MoreIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="user-table__cards">
        {paginatedUsers.length === 0 ? (
          <div className="user-table__cards-empty">No users found</div>
        ) : (
          paginatedUsers.map((user) => (
            <div className="user-table__card" key={user.id}>
              <div className="user-table__card-header">
                <div className="user-table__card-name">{user.userName}</div>
                <div className="user-table__card-actions">
                  <span className={`user-table__status user-table__status--${statusClassMap[user.status]}`}>
                    {user.status}
                  </span>
                  <button
                    className="user-table__more-btn"
                    type="button"
                    ref={(el) => { moreBtnRefs.current[user.id] = el; }}
                    onClick={() => toggleMenu(user.id)}
                    aria-label="More actions"
                  >
                    <MoreIcon />
                  </button>
                </div>
              </div>
              <div className="user-table__card-body">
                <div className="user-table__card-row">
                  <span className="user-table__card-label">Organization</span>
                  <span className="user-table__card-value">{user.orgName}</span>
                </div>
                <div className="user-table__card-row">
                  <span className="user-table__card-label">Email</span>
                  <span className="user-table__card-value">{user.email}</span>
                </div>
                <div className="user-table__card-row">
                  <span className="user-table__card-label">Phone</span>
                  <span className="user-table__card-value">{user.phoneNumber}</span>
                </div>
                <div className="user-table__card-row">
                  <span className="user-table__card-label">Date Joined</span>
                  <span className="user-table__card-value">{formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action menu – rendered via portal to escape overflow clipping */}
      {activeMenu && createPortal(
        <div
          className="user-table__action-menu"
          ref={menuRef}
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <button type="button" onClick={() => handleViewDetails(activeMenu)}>
            <EyeIcon />
            <span>View Details</span>
          </button>
          <button type="button" onClick={() => setActiveMenu(null)}>
            <UserXIcon />
            <span>Blacklist User</span>
          </button>
          <button type="button" onClick={() => setActiveMenu(null)}>
            <UserCheckIcon />
            <span>Activate User</span>
          </button>
        </div>,
        document.body,
      )}

      {/* Pagination */}
      <div className="user-table__pagination">
        <div className="user-table__pagination-info">
          <span>Showing</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="user-table__pagination-select"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>out of {filteredUsers.length}</span>
        </div>

        <div className="user-table__pagination-controls">
          <button
            className="user-table__pagination-arrow"
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
          </button>

          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span key={`ellipsis-${i}`} className="user-table__pagination-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                className={`user-table__pagination-page ${
                  currentPage === page ? "user-table__pagination-page--active" : ""
                }`}
                onClick={() => setCurrentPage(page as number)}
              >
                {page}
              </button>
            )
          )}

          <button
            className="user-table__pagination-arrow"
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            aria-label="Next page"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
