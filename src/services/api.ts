import axios from 'axios';
import type { User, UserStatus } from '../types';

const API_BASE_URL =
  'https://6270020422c706a0ae70b72c.mockapi.io/lendsqr/api/v1';

/**
 * Deterministic hash from a string – produces a positive integer.
 * Used so that generated mock fields stay consistent across calls for
 * the same user id.
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function pickFrom<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/**
 * Maps a raw user object coming from the MockAPI endpoint to the
 * internal `User` type.  Fields that the API does not provide are
 * generated deterministically from the user id so the data is
 * consistent on every fetch.
 */
function mapApiUserToUser(apiUser: any): User {
  const id: string = String(apiUser.id);
  const seed = simpleHash(id);

  // ── Status ────────────────────────────────────────────────────
  const statuses: UserStatus[] = [
    'Active',
    'Inactive',
    'Pending',
    'Blacklisted',
  ];
  const status = pickFrom(statuses, seed);

  // ── Personal info ─────────────────────────────────────────────
  const genders = ['Male', 'Female'];
  const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  const childrenOptions = ['None', '1', '2', '3', '4', '5+'];
  const residenceTypes = [
    "Parent's Apartment",
    'Personal Apartment',
    'Rented Apartment',
    'Shared Apartment',
  ];

  const personalInfo = {
    fullName: apiUser.userName || `User ${id}`,
    phoneNumber: apiUser.phoneNumber || `080${String(seed).padStart(8, '0').slice(0, 8)}`,
    email: apiUser.email || `user${id}@lendsqr.com`,
    bvn: String(seed).padStart(11, '0').slice(0, 11),
    gender: pickFrom(genders, seed),
    maritalStatus: pickFrom(maritalStatuses, seed + 1),
    children: pickFrom(childrenOptions, seed + 2),
    typeOfResidence: pickFrom(residenceTypes, seed + 3),
  };

  // ── Education & Employment ────────────────────────────────────
  const educationLevels = ['B.Sc', 'M.Sc', 'HND', 'PhD', 'OND'];
  const employmentStatuses = [
    'Employed',
    'Self-Employed',
    'Unemployed',
    'Student',
  ];
  const sectors = [
    'FinTech',
    'Agriculture',
    'Technology',
    'Education',
    'Healthcare',
    'Real Estate',
    'Oil and Gas',
    'Entertainment',
  ];
  const durations = [
    '1 year',
    '2 years',
    '3 years',
    '5 years',
    '10+ years',
  ];

  const lowerIncome = ((seed % 8) + 1) * 50000;
  const upperIncome = lowerIncome + ((seed % 5) + 1) * 100000;

  const educationAndEmployment = {
    levelOfEducation: pickFrom(educationLevels, seed + 4),
    employmentStatus: pickFrom(employmentStatuses, seed + 5),
    sectorOfEmployment: pickFrom(sectors, seed + 6),
    durationOfEmployment: pickFrom(durations, seed + 7),
    officeEmail: `office.${id}@lendsqr.com`,
    monthlyIncome: [
      `₦${lowerIncome.toLocaleString()}`,
      `₦${upperIncome.toLocaleString()}`,
    ],
    loanRepayment: `₦${((seed % 20) + 1) * 5000}`,
  };

  // ── Socials ───────────────────────────────────────────────────
  const handle =
    (apiUser.userName || `user${id}`).replace(/\s+/g, '').toLowerCase();

  const socials = {
    twitter: `@${handle}`,
    facebook: handle,
    instagram: `@${handle}`,
  };

  // ── Guarantor ─────────────────────────────────────────────────
  const firstNames = [
    'Adebayo',
    'Chinedu',
    'Funke',
    'Oluwaseun',
    'Ngozi',
    'Ibrahim',
    'Temitope',
    'Amara',
    'Emeka',
    'Yetunde',
  ];
  const lastNames = [
    'Okonkwo',
    'Adeyemi',
    'Balogun',
    'Nwosu',
    'Akinola',
    'Obi',
    'Mohammed',
    'Eze',
    'Okafor',
    'Adesanya',
  ];
  const relationships = [
    'Parent',
    'Sibling',
    'Friend',
    'Colleague',
    'Spouse',
  ];

  const guarantorFirst = pickFrom(firstNames, seed + 8);
  const guarantorLast = pickFrom(lastNames, seed + 9);

  const guarantor = {
    fullName: `${guarantorFirst} ${guarantorLast}`,
    phoneNumber: `081${String(seed + 99).padStart(8, '0').slice(0, 8)}`,
    email: `${guarantorFirst.toLowerCase()}.${guarantorLast.toLowerCase()}@gmail.com`,
    relationship: pickFrom(relationships, seed + 10),
  };

  // ── Assembled User ────────────────────────────────────────────
  return {
    id,
    orgName: apiUser.orgName || pickFrom(sectors, seed + 11),
    userName: apiUser.userName || `user${id}`,
    email: apiUser.email || personalInfo.email,
    phoneNumber: apiUser.phoneNumber || personalInfo.phoneNumber,
    createdAt: apiUser.createdAt || new Date().toISOString(),
    status,
    personalInfo,
    educationAndEmployment,
    socials,
    guarantor,
  };
}

/**
 * Generates a synthetic raw user object (mimicking the MockAPI shape)
 * from a numeric index.  These are fed through `mapApiUserToUser` so
 * every generated user gets the same rich, deterministic field set.
 */
function generateRawUser(index: number) {
  const seed = simpleHash(`gen-${index}`);

  const firstNames = [
    'Adebayo', 'Chinedu', 'Funke', 'Oluwaseun', 'Ngozi',
    'Ibrahim', 'Temitope', 'Amara', 'Emeka', 'Yetunde',
    'Obinna', 'Kemi', 'Tunde', 'Aisha', 'Chioma',
    'Segun', 'Halima', 'Bola', 'Uche', 'Zainab',
    'Adeola', 'Chidi', 'Folake', 'Gbenga', 'Hauwa',
    'Ikenna', 'Jumoke', 'Kunle', 'Lola', 'Musa',
    'Nkechi', 'Olu', 'Patience', 'Rasheed', 'Sade',
    'Toyin', 'Ugochi', 'Victor', 'Wale', 'Yemi',
  ];
  const lastNames = [
    'Okonkwo', 'Adeyemi', 'Balogun', 'Nwosu', 'Akinola',
    'Obi', 'Mohammed', 'Eze', 'Okafor', 'Adesanya',
    'Adeleke', 'Chukwu', 'Danjuma', 'Ezeigbo', 'Fashola',
    'Garba', 'Hassan', 'Igwe', 'Jimoh', 'Kalu',
    'Lawal', 'Madu', 'Nnamdi', 'Ogundele', 'Peters',
    'Quadri', 'Rufai', 'Salami', 'Taiwo', 'Usman',
  ];
  const orgNames = [
    'Lendsqr', 'Irorun', 'Lendstar', 'Paystack', 'Kuda',
    'Flutterwave', 'Interswitch', 'Carbon', 'FairMoney', 'PalmPay',
    'Moniepoint', 'OPay', 'Piggyvest', 'Cowrywise', 'Bamboo',
    'Risevest', 'Trove', 'Chipper Cash', 'TeamApt', 'Mono',
  ];

  const firstName = pickFrom(firstNames, seed);
  const lastName = pickFrom(lastNames, seed + 1);
  const userName = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${pickFrom(orgNames, seed + 2).toLowerCase().replace(/\s+/g, '')}.com`;
  const phone = `0${pickFrom([70, 80, 81, 90, 91], seed + 3)}${String(seed).padStart(8, '0').slice(0, 8)}`;

  // Spread createdAt dates across 2020-01-01 to 2025-12-31
  const startMs = new Date('2020-01-01').getTime();
  const endMs = new Date('2025-12-31').getTime();
  const createdAt = new Date(startMs + (seed % (endMs - startMs))).toISOString();

  return {
    id: String(1000 + index),           // IDs start at 1000 to avoid clashes with API users
    orgName: pickFrom(orgNames, seed + 4),
    userName,
    email,
    phoneNumber: phone,
    createdAt,
  };
}

/** Total number of users the app should expose. */
const TARGET_USER_COUNT = 500;

/**
 * Fetch all users.
 * The MockAPI free-tier returns ~100 records.  To meet the 500-user
 * target the remaining users are generated locally and merged in.
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    const apiUsers: User[] = response.data.map((user: any) =>
      mapApiUserToUser(user),
    );

    // Generate enough extra users to reach the target count
    const extraCount = Math.max(0, TARGET_USER_COUNT - apiUsers.length);
    const generatedUsers: User[] = Array.from({ length: extraCount }, (_, i) =>
      mapApiUserToUser(generateRawUser(i)),
    );

    return [...apiUsers, ...generatedUsers];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Fetch a single user by their id.
 * For locally-generated users (id >= 1000) we reconstruct the user
 * from the same deterministic generator instead of hitting the API.
 */
export const fetchUserById = async (id: string): Promise<User> => {
  const numericId = Number(id);

  // Locally-generated users have IDs starting at 1000
  if (numericId >= 1000) {
    const index = numericId - 1000;
    return mapApiUserToUser(generateRawUser(index));
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return mapApiUserToUser(response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
