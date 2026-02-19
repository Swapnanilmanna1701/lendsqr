import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { removeFromLocalStorage } from "../../utils/localStorage";
import "./Sidebar.scss";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ──────────────────── Inline SVG Icons (16x16) ──────────────────── */

const BriefcaseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 4H11V3C11 2.17 10.33 1.5 9.5 1.5H6.5C5.67 1.5 5 2.17 5 3V4H2C1.17 4 0.5 4.67 0.5 5.5V12.5C0.5 13.33 1.17 14 2 14H14C14.83 14 15.5 13.33 15.5 12.5V5.5C15.5 4.67 14.83 4 14 4ZM6.5 3H9.5V4H6.5V3ZM14 12.5H2V9H5V10H11V9H14V12.5ZM14 7.5H2V5.5H14V7.5Z" fill="currentColor"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6L8 1.33333L14 6V13.3333C14 13.687 13.8595 14.0261 13.6095 14.2761C13.3594 14.5262 13.0203 14.6667 12.6667 14.6667H3.33333C2.97971 14.6667 2.64057 14.5262 2.39052 14.2761C2.14048 14.0261 2 13.687 2 13.3333V6Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 14.6667V8H10V14.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.3333 14V12.6667C11.3333 11.9594 11.0524 11.2811 10.5523 10.781C10.0522 10.281 9.37391 10 8.66667 10H3.33333C2.62609 10 1.94781 10.281 1.44772 10.781C0.947621 11.2811 0.666668 11.9594 0.666668 12.6667V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 7.33333C7.47276 7.33333 8.66667 6.13943 8.66667 4.66667C8.66667 3.19391 7.47276 2 6 2C4.52724 2 3.33333 3.19391 3.33333 4.66667C3.33333 6.13943 4.52724 7.33333 6 7.33333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.3333 14V12.6667C15.3329 12.0758 15.1362 11.5019 14.7742 11.0349C14.4123 10.5679 13.9054 10.2344 13.3333 10.0867" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.6667 2.08667C11.2403 2.23354 11.749 2.56714 12.1121 3.03488C12.4752 3.50262 12.6722 4.07789 12.6722 4.67C12.6722 5.26211 12.4752 5.83738 12.1121 6.30512C11.749 6.77286 11.2403 7.10646 10.6667 7.25333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GuarantorsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.3333 14V12.6667C11.3333 11.9594 11.0524 11.2811 10.5523 10.781C10.0522 10.281 9.37391 10 8.66667 10H3.33333C2.62609 10 1.94781 10.281 1.44772 10.781C0.947621 11.2811 0.666668 11.9594 0.666668 12.6667V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 7.33333C7.47276 7.33333 8.66667 6.13943 8.66667 4.66667C8.66667 3.19391 7.47276 2 6 2C4.52724 2 3.33333 3.19391 3.33333 4.66667C3.33333 6.13943 4.52724 7.33333 6 7.33333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 7.33333L14.6667 9L13 10.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.6667 9H11.3333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.33333 1.33333H10.6667L12 4L8 6.66667L4 4L5.33333 1.33333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 4C2.4 5.6 1.33333 8 1.33333 10.6667C1.33333 12.5 3.33333 14.6667 8 14.6667C12.6667 14.6667 14.6667 12.5 14.6667 10.6667C14.6667 8 13.6 5.6 12 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HandshakeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.33333 8.66667L4.66667 5.33333L7.33333 6.66667L10 4L14.6667 8.66667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 4H14.6667V8.66667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.66667 12L7.33333 14.6667L10 12L12.6667 14.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PiggyBankIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3333 7.33333C13.3333 5.33333 11.3333 3.33333 8.66667 3.33333C6 3.33333 4 5.33333 4 7.33333C4 9.33333 6 11.3333 8.66667 11.3333C9.66667 11.3333 10.6667 11 11.3333 10.6667L14 12V9.33333C13.6667 8.66667 13.3333 8 13.3333 7.33333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 7.33333C4 7.33333 2.66667 7 2 7.33333C1.33333 7.66667 1.33333 9.33333 2 10C2.66667 10.6667 4 10.6667 4 10.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7.33333" cy="6.33333" r="0.666667" fill="currentColor"/>
    <circle cx="10" cy="6.33333" r="0.666667" fill="currentColor"/>
  </svg>
);

const LoanRequestIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.33333 8H10.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 5.33333V10.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.6667 14V12.6667C10.6667 11.9594 10.3857 11.2811 9.88562 10.781C9.38552 10.281 8.70724 10 8 10H3.33333C2.62609 10 1.94781 10.281 1.44772 10.781C0.947621 11.2811 0.666668 11.9594 0.666668 12.6667V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.66667 7.33333C7.13943 7.33333 8.33333 6.13943 8.33333 4.66667C8.33333 3.19391 7.13943 2 5.66667 2C4.19391 2 3 3.19391 3 4.66667C3 6.13943 4.19391 7.33333 5.66667 7.33333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.3333 5.33333L12.6667 6.66667L15.3333 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserTimesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.6667 14V12.6667C10.6667 11.9594 10.3857 11.2811 9.88562 10.781C9.38552 10.281 8.70724 10 8 10H3.33333C2.62609 10 1.94781 10.281 1.44772 10.781C0.947621 11.2811 0.666668 11.9594 0.666668 12.6667V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.66667 7.33333C7.13943 7.33333 8.33333 6.13943 8.33333 4.66667C8.33333 3.19391 7.13943 2 5.66667 2C4.19391 2 3 3.19391 3 4.66667C3 6.13943 4.19391 7.33333 5.66667 7.33333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 4.66667L15.3333 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.3333 4.66667L12 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const OrganizationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.33333 14H14.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 14V3.33333C2 2.96514 2.29848 2.66667 2.66667 2.66667H7.33333C7.70152 2.66667 8 2.96514 8 3.33333V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6H13.3333C13.7015 6 14 6.29848 14 6.66667V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 5.33333H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 8H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 10.6667H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 8.66667H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11.3333H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LoanProductsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3333 4H2.66667C1.93029 4 1.33333 4.59695 1.33333 5.33333V12C1.33333 12.7364 1.93029 13.3333 2.66667 13.3333H13.3333C14.0697 13.3333 14.6667 12.7364 14.6667 12V5.33333C14.6667 4.59695 14.0697 4 13.3333 4Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.33333 7.33333H14.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.66667 2.66667V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.3333 2.66667V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SavingsProductsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.33333V14.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.3333 3.33333H6.33333C5.71449 3.33333 5.121 3.57917 4.68342 4.01675C4.24583 4.45434 4 5.04783 4 5.66667C4 6.2855 4.24583 6.879 4.68342 7.31658C5.121 7.75417 5.71449 8 6.33333 8H9.66667C10.2855 8 10.879 8.24583 11.3166 8.68342C11.7542 9.121 12 9.71449 12 10.3333C12 10.9522 11.7542 11.5457 11.3166 11.9832C10.879 12.4208 10.2855 12.6667 9.66667 12.6667H4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FeesChargesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 4.66667H2C1.26362 4.66667 0.666668 5.26362 0.666668 6V12.6667C0.666668 13.403 1.26362 14 2 14H14C14.7364 14 15.3333 13.403 15.3333 12.6667V6C15.3333 5.26362 14.7364 4.66667 14 4.66667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 11.3333C9.10457 11.3333 10 10.4379 10 9.33333C10 8.22876 9.10457 7.33333 8 7.33333C6.89543 7.33333 6 8.22876 6 9.33333C6 10.4379 6.89543 11.3333 8 11.3333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.6667 2L5.33333 4.66667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TransactionsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.6667 4L8.66667 10L6 7.33333L1.33333 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.6667 4H14.6667V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ServicesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.9333 10C12.8445 10.2012 12.818 10.4236 12.857 10.6395C12.8961 10.8553 12.999 11.0547 13.1533 11.2133L13.1933 11.2533C13.3175 11.3774 13.4162 11.5245 13.4836 11.6863C13.5511 11.848 13.586 12.0212 13.586 12.1963C13.586 12.3713 13.5511 12.5446 13.4836 12.7063C13.4162 12.868 13.3175 13.0152 13.1933 13.1393C13.0692 13.2636 12.9221 13.3622 12.7603 13.4297C12.5986 13.4971 12.4253 13.5321 12.2503 13.5321C12.0752 13.5321 11.902 13.4971 11.7403 13.4297C11.5785 13.3622 11.4314 13.2636 11.3073 13.1393L11.2673 13.0993C11.1087 12.945 10.9094 12.8421 10.6935 12.803C10.4776 12.764 10.2552 12.7905 10.054 12.8793C9.85688 12.9641 9.68876 13.1042 9.56975 13.2831C9.45074 13.4621 9.38597 13.6723 9.38333 13.888V14C9.38333 14.3536 9.24286 14.6928 8.99281 14.9428C8.74276 15.1929 8.40362 15.3333 8.05 15.3333C7.69638 15.3333 7.35724 15.1929 7.10719 14.9428C6.85714 14.6928 6.71667 14.3536 6.71667 14V13.9433C6.71005 13.7221 6.63814 13.508 6.5102 13.3281C6.38225 13.1481 6.20402 13.0106 5.99667 12.9327C5.79542 12.8439 5.57304 12.8174 5.35717 12.8564C5.14129 12.8955 4.94197 12.9984 4.78333 13.1527L4.74333 13.1927C4.61924 13.3169 4.47213 13.4156 4.31036 13.483C4.14859 13.5505 3.97536 13.5854 3.80033 13.5854C3.62531 13.5854 3.45208 13.5505 3.29031 13.483C3.12854 13.4156 2.98143 13.3169 2.85733 13.1927C2.73308 13.0686 2.63443 12.9215 2.56699 12.7597C2.49955 12.598 2.46462 12.4247 2.46462 12.2497C2.46462 12.0747 2.49955 11.9014 2.56699 11.7397C2.63443 11.5779 2.73308 11.4308 2.85733 11.3067L2.89733 11.2667C3.05164 11.108 3.15449 10.9087 3.19356 10.6928C3.23262 10.477 3.20614 10.2546 3.11733 10.0533C3.03253 9.85621 2.89239 9.68809 2.71348 9.56909C2.53457 9.45008 2.3243 9.3853 2.10867 9.38267H2C1.64638 9.38267 1.30724 9.24219 1.05719 8.99214C0.807142 8.74209 0.666668 8.40296 0.666668 8.04933C0.666668 7.69571 0.807142 7.35657 1.05719 7.10652C1.30724 6.85648 1.64638 6.716 2 6.716H2.05667C2.27787 6.70938 2.49196 6.63747 2.67193 6.50953C2.8519 6.38158 2.98943 6.20336 3.06733 5.996C3.15614 5.79476 3.18262 5.57237 3.14356 5.3565C3.10449 5.14063 3.00164 4.9413 2.84733 4.78267L2.80733 4.74267C2.68308 4.61857 2.58443 4.47146 2.51699 4.30969C2.44955 4.14792 2.41462 3.97469 2.41462 3.79967C2.41462 3.62464 2.44955 3.45141 2.51699 3.28964C2.58443 3.12787 2.68308 2.98076 2.80733 2.85667C2.93143 2.73242 3.07854 2.63376 3.24031 2.56633C3.40208 2.49889 3.57531 2.46396 3.75033 2.46396C3.92536 2.46396 4.09859 2.49889 4.26036 2.56633C4.42213 2.63376 4.56924 2.73242 4.69333 2.85667L4.73333 2.89667C4.89197 3.05097 5.09129 3.15383 5.30717 3.19289C5.52304 3.23196 5.74542 3.20547 5.94667 3.11667H6C6.19714 3.03187 6.36526 2.89173 6.48427 2.71281C6.60327 2.5339 6.66805 2.32364 6.67067 2.108V2C6.67067 1.64638 6.81114 1.30724 7.06119 1.05719C7.31124 0.807142 7.65038 0.666668 8.004 0.666668C8.35762 0.666668 8.69676 0.807142 8.94681 1.05719C9.19686 1.30724 9.33733 1.64638 9.33733 2V2.05667C9.33996 2.2723 9.40473 2.48257 9.52374 2.66148C9.64274 2.84039 9.81087 2.98053 10.008 3.06533C10.2092 3.15414 10.4316 3.18062 10.6475 3.14156C10.8634 3.10249 11.0627 2.99964 11.2213 2.84533L11.2613 2.80533C11.3854 2.68108 11.5325 2.58243 11.6943 2.51499C11.8561 2.44755 12.0293 2.41262 12.2043 2.41262C12.3794 2.41262 12.5526 2.44755 12.7144 2.51499C12.8761 2.58243 13.0232 2.68108 13.1473 2.80533C13.2716 2.92943 13.3702 3.07654 13.4377 3.23831C13.5051 3.40008 13.54 3.57331 13.54 3.74833C13.54 3.92336 13.5051 4.09659 13.4377 4.25836C13.3702 4.42013 13.2716 4.56724 13.1473 4.69133L13.1073 4.73133C12.953 4.88997 12.8502 5.08929 12.8111 5.30517C12.772 5.52104 12.7985 5.74342 12.8873 5.94467V6C12.9721 6.19714 13.1123 6.36526 13.2912 6.48427C13.4701 6.60327 13.6804 6.66805 13.896 6.67067H14C14.3536 6.67067 14.6928 6.81114 14.9428 7.06119C15.1929 7.31124 15.3333 7.65038 15.3333 8.004C15.3333 8.35762 15.1929 8.69676 14.9428 8.94681C14.6928 9.19686 14.3536 9.33733 14 9.33733H13.9433C13.7277 9.33996 13.5174 9.40473 13.3385 9.52374C13.1596 9.64274 13.0195 9.81087 12.9347 10.008" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ServiceAccountIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.6667 14V12.6667C10.6667 11.9594 10.3857 11.2811 9.88562 10.781C9.38552 10.281 8.70724 10 8 10H4C3.29276 10 2.61448 10.281 2.11438 10.781C1.61429 11.2811 1.33333 11.9594 1.33333 12.6667V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 7.33333C7.47276 7.33333 8.66667 6.13943 8.66667 4.66667C8.66667 3.19391 7.47276 2 6 2C4.52724 2 3.33333 3.19391 3.33333 4.66667C3.33333 6.13943 4.52724 7.33333 6 7.33333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 6V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8H16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SettlementsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H2C1.26362 2 0.666668 2.59695 0.666668 3.33333V12.6667C0.666668 13.403 1.26362 14 2 14H14C14.7364 14 15.3333 13.403 15.3333 12.6667V3.33333C15.3333 2.59695 14.7364 2 14 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M0.666668 6.66667H15.3333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ReportsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12.6667V5.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 12.6667V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12.6667V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 12.6667V4.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PreferencesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2.66667H8.66667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.33333 2.66667H2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 8H7.33333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 8H2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 13.3333H10.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.33333 13.3333H2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.66667 1.33333V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6.66667V9.33333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.6667 12V14.6667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FeesPricingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.33333 1.33333H4C3.64638 1.33333 3.30724 1.47381 3.05719 1.72386C2.80714 1.97391 2.66667 2.31304 2.66667 2.66667V13.3333C2.66667 13.687 2.80714 14.0261 3.05719 14.2761C3.30724 14.5262 3.64638 14.6667 4 14.6667H12C12.3536 14.6667 12.6928 14.5262 12.9428 14.2761C13.1929 14.0261 13.3333 13.687 13.3333 13.3333V5.33333L9.33333 1.33333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.33333 1.33333V5.33333H13.3333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 8.66667H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 11.3333H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AuditLogsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 8.66667V3.33333C14 2.97971 13.8595 2.64057 13.6095 2.39052C13.3594 2.14048 13.0203 2 12.6667 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.6667 12.6667C13.7712 12.6667 14.6667 11.7712 14.6667 10.6667C14.6667 9.5621 13.7712 8.66667 12.6667 8.66667C11.5621 8.66667 10.6667 9.5621 10.6667 10.6667C10.6667 11.7712 11.5621 12.6667 12.6667 12.6667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.2 12.2L15.3333 13.3333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SystemMessagesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 10.6667C14 11.0203 13.8595 11.3594 13.6095 11.6095C13.3594 11.8595 13.0203 12 12.6667 12H4.66667L2 14.6667V4.66667C2 4.31304 2.14048 3.97391 2.39052 3.72386C2.64057 3.47381 2.97971 3.33333 3.33333 3.33333H12.6667C13.0203 3.33333 13.3594 3.47381 13.6095 3.72386C13.8595 3.97391 14 4.31304 14 4.66667V10.6667Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.33333 7H5.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 7H8.00667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.6667 7H10.6733" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.6667 11.3333L14 8L10.6667 4.66667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 8H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ──────────────────── Menu Data ──────────────────── */

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  to?: string;
}

interface MenuSection {
  heading: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    heading: "CUSTOMERS",
    items: [
      { label: "Users", icon: <UsersIcon />, to: "/dashboard/users" },
      { label: "Guarantors", icon: <GuarantorsIcon /> },
      { label: "Loans", icon: <SackIcon /> },
      { label: "Decision Models", icon: <HandshakeIcon /> },
      { label: "Savings", icon: <PiggyBankIcon /> },
      { label: "Loan Requests", icon: <LoanRequestIcon /> },
      { label: "Whitelist", icon: <UserCheckIcon /> },
      { label: "Karma", icon: <UserTimesIcon /> },
    ],
  },
  {
    heading: "BUSINESSES",
    items: [
      { label: "Organization", icon: <OrganizationIcon /> },
      { label: "Loan Products", icon: <LoanProductsIcon /> },
      { label: "Savings Products", icon: <SavingsProductsIcon /> },
      { label: "Fees and Charges", icon: <FeesChargesIcon /> },
      { label: "Transactions", icon: <TransactionsIcon /> },
      { label: "Services", icon: <ServicesIcon /> },
      { label: "Service Account", icon: <ServiceAccountIcon /> },
      { label: "Settlements", icon: <SettlementsIcon /> },
      { label: "Reports", icon: <ReportsIcon /> },
    ],
  },
  {
    heading: "SETTINGS",
    items: [
      { label: "Preferences", icon: <PreferencesIcon /> },
      { label: "Fees and Pricing", icon: <FeesPricingIcon /> },
      { label: "Audit Logs", icon: <AuditLogsIcon /> },
      { label: "System Messages", icon: <SystemMessagesIcon /> },
    ],
  },
];

/* ──────────────────── Sidebar Component ──────────────────── */

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeFromLocalStorage("lendsqr_auth");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div
        className={`sidebar-backdrop ${isOpen ? "sidebar-backdrop--visible" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        {/* Switch Organization */}
        <div className="sidebar__switch-org">
          <BriefcaseIcon />
          <span>Switch Organization</span>
          <ChevronDownIcon />
        </div>

        {/* Dashboard link */}
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `sidebar__menu-item sidebar__dashboard ${isActive ? "sidebar__menu-item--active" : ""}`
          }
        >
          <HomeIcon />
          <span>Dashboard</span>
        </NavLink>

        {/* Menu Sections */}
        {menuSections.map((section) => (
          <div className="sidebar__section" key={section.heading}>
            <h4 className="sidebar__section-heading">{section.heading}</h4>
            {section.items.map((item) =>
              item.to ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar__menu-item ${isActive ? "sidebar__menu-item--active" : ""}`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ) : (
                <a key={item.label} className="sidebar__menu-item" href="#">
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              )
            )}
          </div>
        ))}

        {/* Divider */}
        <hr className="sidebar__divider" />

        {/* Logout */}
        <button
          type="button"
          className="sidebar__menu-item sidebar__logout"
          onClick={handleLogout}
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>

        {/* Version */}
        <p className="sidebar__version">v1.2.0</p>
      </aside>
    </>
  );
};

export default Sidebar;
