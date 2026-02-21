import React, { useCallback, useEffect, useState } from "react";
import StatsCard from "../../components/StatsCard";
import UserTable from "../../components/UserTable";
import type { User, UserStatus } from "../../types";
import { fetchUsers } from "../../services/api";
import { saveAllUsers, getAllUsers } from "../../utils/indexedDB";
import "./Users.scss";

const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11 11C13.7614 11 16 8.76142 16 6C16 3.23858 13.7614 1 11 1C8.23858 1 6 3.23858 6 6C6 8.76142 8.23858 11 11 11Z"
      stroke="#DF18FF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 21C1 16.5817 5.47715 13 11 13C16.5228 13 21 16.5817 21 21"
      stroke="#DF18FF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ActiveUsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 11C10.2091 11 12 9.20914 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11Z"
      stroke="#5718FF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 19C1 15.134 4.13401 12 8 12C11.866 12 15 15.134 15 19"
      stroke="#5718FF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 3C16.0609 3.26817 16.9998 3.88259 17.6799 4.74145C18.3599 5.60031 18.7434 6.65473 18.7703 7.74894C18.7971 8.84315 18.4659 9.91518 17.828 10.8059C17.1901 11.6966 16.2811 12.3568 15.237 12.677"
      stroke="#5718FF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 19C18.866 19 20.5 17.5 21 16"
      stroke="#5718FF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UsersWithLoansIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 1H4C2.34315 1 1 2.34315 1 4V18C1 19.6569 2.34315 21 4 21H18C19.6569 21 21 19.6569 21 18V4C21 2.34315 19.6569 1 18 1Z"
      stroke="#F55F44"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6 6H16" stroke="#F55F44" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 10H16" stroke="#F55F44" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 14H12" stroke="#F55F44" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const UsersWithSavingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.5 16C7.5 16 2 14 2 8.5C2 3 7.5 1 11 1C14.5 1 20 3 20 8.5C20 14 14.5 16 14.5 16"
      stroke="#FF3366"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 12C12.6569 12 14 10.6569 14 9C14 7.34315 12.6569 6 11 6C9.34315 6 8 7.34315 8 9C8 10.6569 9.34315 12 11 12Z"
      stroke="#FF3366"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M7 21H15" stroke="#FF3366" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 18H13" stroke="#FF3366" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 16V18" stroke="#FF3366" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13 16V18" stroke="#FF3366" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchUsers();
        setUsers(data);
        // Cache to IndexedDB for offline fallback
        await saveAllUsers(data);
      } catch {
        // API failed — attempt IndexedDB cache
        try {
          const cached = await getAllUsers();
          if (cached.length > 0) {
            setUsers(cached);
          } else {
            setError("Failed to fetch users. Please try again later.");
          }
        } catch {
          setError("Failed to fetch users. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleStatusChange = useCallback((userId: string, newStatus: UserStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  }, []);

  const activeUsers = users.filter((u) => u.status === "Active").length;
  const usersWithLoans = Math.round(users.length * 0.3);
  const usersWithSavings = Math.round(users.length * 0.6);

  const statsData = [
    {
      icon: <UsersIcon />,
      title: "USERS",
      value: users.length.toLocaleString(),
      iconBgColor: "rgba(223, 24, 255, 0.1)",
    },
    {
      icon: <ActiveUsersIcon />,
      title: "ACTIVE USERS",
      value: activeUsers.toLocaleString(),
      iconBgColor: "rgba(87, 24, 255, 0.04)",
    },
    {
      icon: <UsersWithLoansIcon />,
      title: "USERS WITH LOANS",
      value: usersWithLoans.toLocaleString(),
      iconBgColor: "rgba(245, 95, 68, 0.1)",
    },
    {
      icon: <UsersWithSavingsIcon />,
      title: "USERS WITH SAVINGS",
      value: usersWithSavings.toLocaleString(),
      iconBgColor: "rgba(255, 51, 102, 0.1)",
    },
  ];

  if (error) {
    return (
      <div className="users-page">
        <h1 className="users-page__title">Users</h1>
        <div className="users-page__error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <h1 className="users-page__title">Users</h1>

      <div className="users-page__stats">
        {statsData.map((stat) => (
          <StatsCard
            key={stat.title}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            iconBgColor={stat.iconBgColor}
          />
        ))}
      </div>

      <UserTable users={users} loading={loading} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default Users;
