-- SQL to reset all tables and start IDs at 0
TRUNCATE TABLE "Citizens", "Employees", "Departments", "Complaints", "Feedbacks", "Bills", "Services", "AdminUsers" RESTART IDENTITY CASCADE;

-- Explicitly set sequences to start at 0
-- Note: PostgreSQL identity sequences usually start at 1. We force 0.
ALTER SEQUENCE "Citizens_IDNo_seq" RESTART WITH 0;
ALTER SEQUENCE "Employees_EID_seq" RESTART WITH 0;
ALTER SEQUENCE "Departments_DNo_seq" RESTART WITH 0;
ALTER SEQUENCE "Complaints_CNo_seq" RESTART WITH 0;
ALTER SEQUENCE "Feedbacks_FNo_seq" RESTART WITH 0;
ALTER SEQUENCE "Bills_BillID_seq" RESTART WITH 0;
ALTER SEQUENCE "Services_SNo_seq" RESTART WITH 0;
ALTER SEQUENCE "AdminUsers_Id_seq" RESTART WITH 0;
