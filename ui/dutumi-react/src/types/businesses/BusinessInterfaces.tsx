import {PaymentTransaction} from '../PaymentTransactions';
import {User} from '../system/AuthInterfaces';

export interface Business {
    id: number,
    name: string,
    phoneNumber: string,
    email: string,
    schemaName: string,
    channel: string,
    amount: number,
    package: string,
    startDate: string,
    renewedDate: string,
    endDate: string,
    createdDate: string,
    status: string,
    physicalAddress: string,
    subscription : LicenseSubscription,
    owner : User,
    stats : Stats,
    transactions : PaymentTransaction[]
}

export interface LicenseSubscription {
    createdDate: string,
    id: string,
    businessId: string,
    subscriptionPlanId: string,
    paymentTransactionId: string,
    startDate: string,
    endDate: string,
    numberOfMonths: number,
    isActive: string,
    status: string,
    name: string,
    price: number,
    discountAmount: number,
    amountDue: number,
    amountPaid: number,
    promoCode: string,
    supportLevel: string,
    numberOfUsers: number,
    numberOfBranches: number,
    remark: string,
    paymentMethod: string,
    paymentChannel: string,
    transactionReferenceNumber: string,
    licenseCode: string,
    remainingDays: number,
    hasExpired: string
}

export interface SubscriptionStats {
    activeDayPackage: number,
    activeWeekPackage: number,
    activeMonthPackage: number,
    expiredSubscriptions: number
}

export interface SubscriptionPlan {
    createdDate: string,
    id: string,
    planName: string,
    code: string,
    price: number,
    extraUserPrice: number,
    extraBranchPrice: number,
    discountAmount: number,
    supportLevel: string,
    numberOfUsers: number,
    numberOfBranches: number,
    numberOfMonths: number,
    isActive: true
}

export interface Branch {
    id: number,
    name: string,
    physicalAddress: string,
    status: string,
    createdDate: string
}

export interface Staff {
    id: string,
    businessId: string,
    userId: string,
    firstName: string,
    middleName: string,
    lastName: string,
    email: string ,
    phoneNumber: string,
    status: string,
    isBusinessAdmin: string,
    statusRemark: string,
    assignedBranchesCount: string,
    branchAssignments: string,
    currentBranchStaff: string,
    currentBranch: string,
    fullName: string,
    businessUserPermissions: [],
    branchPermissions: [],
    reference: string,
    isActive: boolean,
    isOwner: boolean,
    createdDate: string
}

export interface RemindersStats {
    expiredSubscriptions: number,
    sentReminders: number,
    pendingReminders: number,
    reminderMessage: string
}

export interface Stats{
    "usersCount": number,
    "branchesCount": number,
    "staffCount": number,
    "products": number,
    "variants": number,
    "orders": number,
    "loginSessions": number
}
