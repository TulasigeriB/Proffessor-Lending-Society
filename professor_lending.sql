-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2025 at 03:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `professor_lending`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `log_id` varchar(50) NOT NULL,
  `member_id` varchar(50) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `action_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`log_id`, `member_id`, `action`, `action_date`, `details`) VALUES
('AL001', 'M001', 'login', '2024-11-24 04:35:00', 'Dr. Anil Sharma logged in'),
('AL002', 'M002', 'loan_application', '2024-11-24 07:30:00', 'Applied for loan L001'),
('AL003', 'M001', 'loan_approval', '2024-11-25 03:30:00', 'Approved loan L001 for Dr. Priya Patel');

-- --------------------------------------------------------

--
-- Table structure for table `committee_members`
--

CREATE TABLE `committee_members` (
  `committee_member_id` varchar(50) NOT NULL,
  `member_id` varchar(50) DEFAULT NULL,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_date` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `role` enum('chair','member') DEFAULT 'member',
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `committee_members`
--

INSERT INTO `committee_members` (`committee_member_id`, `member_id`, `start_date`, `end_date`, `role`, `status`) VALUES
('CM001', 'M001', '2024-11-24 05:30:00', NULL, 'chair', 'active'),
('CM002', 'M003', '2024-11-24 05:45:00', NULL, 'member', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `compliance_documents`
--

CREATE TABLE `compliance_documents` (
  `document_id` varchar(50) NOT NULL,
  `type` enum('bye_law','membership_agreement','loan_agreement') DEFAULT NULL,
  `content` text NOT NULL,
  `version` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `compliance_documents`
--

INSERT INTO `compliance_documents` (`document_id`, `type`, `content`, `version`, `created_date`) VALUES
('D001', 'bye_law', 'Society Bye-Law 2024: Rules for membership and loans...', 1, '2024-11-24 10:30:00'),
('D002', 'membership_agreement', 'Membership Agreement for IIT Faculty Society...', 1, '2024-11-24 10:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `fund`
--

CREATE TABLE `fund` (
  `fund_id` varchar(50) NOT NULL,
  `total_value` decimal(15,2) NOT NULL,
  `available_funds` decimal(15,2) NOT NULL,
  `emergency_reserve` decimal(15,2) NOT NULL,
  `update_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fund`
--

INSERT INTO `fund` (`fund_id`, `total_value`, `available_funds`, `emergency_reserve`, `update_date`) VALUES
('F001', 10000000.00, 7500000.00, 2500000.00, '2024-11-24 09:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

CREATE TABLE `loans` (
  `loan_id` varchar(50) NOT NULL,
  `member_id` varchar(50) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `purpose` varchar(200) DEFAULT NULL,
  `interest_rate` decimal(5,2) NOT NULL,
  `term_months` int(11) NOT NULL,
  `emi` decimal(10,2) NOT NULL,
  `status` enum('pending','approved','repaid','defaulted') DEFAULT 'pending',
  `application_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `approval_date` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `collateral_type` enum('property','vehicle','fixed_deposit','other','') DEFAULT '',
  `collateral_address` varchar(200) DEFAULT NULL,
  `collateral_number` varchar(50) DEFAULT NULL,
  `collateral_value` decimal(10,2) DEFAULT NULL,
  `collateral_details` text DEFAULT NULL,
  `approved_by` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loans`
--

INSERT INTO `loans` (`loan_id`, `member_id`, `amount`, `purpose`, `interest_rate`, `term_months`, `emi`, `status`, `application_date`, `approval_date`, `collateral_type`, `collateral_address`, `collateral_number`, `collateral_value`, `collateral_details`, `approved_by`) VALUES
('L001', 'M002', 500000.00, 'Research Equipment', 8.50, 36, 17150.25, 'approved', '2024-11-24 07:30:00', '2024-11-25 03:30:00', 'fixed_deposit', 'SBI, Bangalore', 'FD123456', 600000.00, 'Fixed deposit with SBI', 'CM001'),
('L002', 'M003', 200000.00, 'Conference Travel', 9.00, 24, 9965.50, 'pending', '2024-11-24 07:45:00', NULL, '', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `member_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `institution` varchar(100) DEFAULT NULL,
  `membership_level` enum('basic','full') DEFAULT 'basic',
  `share_count` int(11) DEFAULT 0,
  `credit_score` decimal(5,2) DEFAULT 700.00,
  `join_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','inactive','exited') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`member_id`, `name`, `email`, `password`, `phone`, `department`, `institution`, `membership_level`, `share_count`, `credit_score`, `join_date`, `status`) VALUES
('2dd9a2fb-b0ec-498d-b422-87fb8eb02abf', 'Admin', 'admin.society@gmail.com', 'Admin@123', '12121212', 'CS', 'KLEIT', '', 20, 700.00, '2024-11-24 02:30:00', 'active'),
('9e6303aa-d76a-432a-aa85-335f69363ec7', 'music layer', 'tulasigerib02@gmail.com', 'CSEaura', '12312312', 'CSE', 'kle', '', 0, 700.00, '2025-05-24 19:15:59', 'active'),
('aba71130-fe71-485d-ba3c-123c9417abe7', 'testUser', 'testemail@gmail.com', 'testpass123', '1234123443', 'CS', 'KLEIT', 'basic', 1, 700.00, '2025-05-24 21:45:15', 'active'),
('M001', 'Dr. Anil Sharma', 'anil.sharma@iitb.ac.in', 'IITB2024', '9876543210', 'Computer Science', 'IIT Bombay', 'full', 50, 750.00, '2024-11-24 04:30:00', 'active'),
('M002', 'Dr. Priya Patel', 'priya.patel@iisc.ac.in', 'IISc2024', '8765432109', 'Physics', 'IISc Bangalore', 'basic', 20, 700.00, '2024-11-24 04:45:00', 'active'),
('M003', 'Dr. Rajesh Kumar', 'rajesh.kumar@du.ac.in', 'DU2024', '7654321098', 'Mathematics', 'Delhi University', 'full', 30, 720.00, '2024-11-24 05:00:00', 'active'),
('M004', 'Dr. Meena Iyer', 'meena.iyer@iitm.ac.in', 'IITM2024', '6543210987', 'Chemistry', 'IIT Madras', 'basic', 10, 680.00, '2024-11-24 05:15:00', 'inactive');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` varchar(50) NOT NULL,
  `member_id` varchar(50) DEFAULT NULL,
  `type` enum('loan_due','share_price_update','compliance_alert','voting_open','voting_result') DEFAULT NULL,
  `message` text NOT NULL,
  `sent_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('sent','pending','failed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `member_id`, `type`, `message`, `sent_date`, `status`) VALUES
('N001', 'M002', 'loan_due', 'EMI of INR 17150.25 due on 2024-12-24 for loan L001', '2024-11-24 11:30:00', 'sent'),
('N002', 'M001', 'share_price_update', 'Share price updated to INR 1050.00', '2024-11-24 11:45:00', 'sent');

-- --------------------------------------------------------

--
-- Table structure for table `proposals`
--

CREATE TABLE `proposals` (
  `proposal_id` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `type` enum('bylaw_change','committee_election','fund_allocation','other') NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `voting_start_date` timestamp NULL DEFAULT NULL,
  `voting_end_date` timestamp NULL DEFAULT NULL,
  `status` enum('pending','open','closed','approved','rejected') DEFAULT 'pending',
  `related_id` varchar(50) DEFAULT NULL,
  `required_votes` int(11) NOT NULL,
  `result` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `proposals`
--

INSERT INTO `proposals` (`proposal_id`, `title`, `description`, `type`, `created_by`, `created_date`, `voting_start_date`, `voting_end_date`, `status`, `related_id`, `required_votes`, `result`) VALUES
('P001', 'Increase Emergency Reserve', 'Proposal to increase emergency reserve to INR 3,000,000', 'fund_allocation', 'M001', '2024-11-24 12:30:00', '2024-11-25 03:30:00', '2024-11-30 12:30:00', 'open', 'F001', 3, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `repayments`
--

CREATE TABLE `repayments` (
  `repayment_id` varchar(50) NOT NULL,
  `loan_id` varchar(50) DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `amount_paid` decimal(10,2) NOT NULL,
  `is_emi` tinyint(1) DEFAULT 1,
  `penalty` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `repayments`
--

INSERT INTO `repayments` (`repayment_id`, `loan_id`, `payment_date`, `amount_paid`, `is_emi`, `penalty`) VALUES
('abd307e8-c964-479b-8281-c85e7e631e13', 'L001', '2025-05-24 14:33:28', 17150.25, 1, 0.00),
('R001', 'L001', '2024-12-24 08:30:00', 17150.25, 1, 0.00),
('R002', 'L001', '2025-01-24 08:30:00', 17150.25, 1, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `shares`
--

CREATE TABLE `shares` (
  `share_id` varchar(50) NOT NULL,
  `member_id` varchar(50) DEFAULT NULL,
  `purchase_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `purchase_price` decimal(10,2) NOT NULL,
  `current_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shares`
--

INSERT INTO `shares` (`share_id`, `member_id`, `purchase_date`, `purchase_price`, `current_price`) VALUES
('6bf1a20b-5e05-4dd6-9417-5c406be903b4', 'M004', '2025-05-24 14:46:29', 1000.00, 1050.00),
('S001', 'M001', '2024-11-24 06:30:00', 1000.00, 1050.00),
('S002', 'M001', '2024-11-24 06:35:00', 1000.00, 1050.00),
('S003', 'M002', '2024-11-24 06:40:00', 1000.00, 1040.00),
('S004', 'M003', '2024-11-24 06:45:00', 1000.00, 1060.00);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` varchar(50) NOT NULL,
  `member_id` varchar(50) DEFAULT NULL,
  `type` enum('share_purchase','share_sale','loan_disbursement','loan_repayment','dividend') DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `related_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `member_id`, `type`, `amount`, `transaction_date`, `related_id`, `description`) VALUES
('T001', 'M001', 'share_purchase', 2000.00, '2024-11-24 06:30:00', 0, 'Purchased 2 shares'),
('T002', 'M002', 'loan_disbursement', 500000.00, '2024-11-25 04:00:00', 0, 'Loan disbursed for research equipment'),
('T003', 'M002', 'loan_repayment', 17150.25, '2024-12-24 08:30:00', 0, 'EMI payment for loan L001');

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `vote_id` varchar(50) NOT NULL,
  `proposal_id` varchar(50) DEFAULT NULL,
  `member_id` varchar(50) DEFAULT NULL,
  `vote_choice` enum('yes','no','abstain') NOT NULL,
  `vote_weight` decimal(10,2) DEFAULT 1.00,
  `vote_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`vote_id`, `proposal_id`, `member_id`, `vote_choice`, `vote_weight`, `vote_date`) VALUES
('V001', 'P001', 'M001', 'yes', 1.00, '2024-11-25 04:30:00'),
('V002', 'P001', 'M002', 'no', 1.00, '2024-11-25 04:45:00'),
('V003', 'P001', 'M003', 'abstain', 1.00, '2024-11-25 05:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `committee_members`
--
ALTER TABLE `committee_members`
  ADD PRIMARY KEY (`committee_member_id`),
  ADD KEY `idx_committee_member_id` (`member_id`);

--
-- Indexes for table `compliance_documents`
--
ALTER TABLE `compliance_documents`
  ADD PRIMARY KEY (`document_id`);

--
-- Indexes for table `fund`
--
ALTER TABLE `fund`
  ADD PRIMARY KEY (`fund_id`);

--
-- Indexes for table `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`loan_id`),
  ADD KEY `idx_loans_member_id` (`member_id`),
  ADD KEY `idx_loans_status` (`status`),
  ADD KEY `idx_loans_approved_by` (`approved_by`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`member_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_members_email` (`email`),
  ADD KEY `idx_members_status` (`status`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `proposals`
--
ALTER TABLE `proposals`
  ADD PRIMARY KEY (`proposal_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_proposals_status` (`status`);

--
-- Indexes for table `repayments`
--
ALTER TABLE `repayments`
  ADD PRIMARY KEY (`repayment_id`),
  ADD KEY `loan_id` (`loan_id`);

--
-- Indexes for table `shares`
--
ALTER TABLE `shares`
  ADD PRIMARY KEY (`share_id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `idx_transactions_date` (`transaction_date`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`vote_id`),
  ADD KEY `idx_votes_proposal_id` (`proposal_id`),
  ADD KEY `idx_votes_member_id` (`member_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE SET NULL;

--
-- Constraints for table `committee_members`
--
ALTER TABLE `committee_members`
  ADD CONSTRAINT `committee_members_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE;

--
-- Constraints for table `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `loans_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `committee_members` (`committee_member_id`) ON DELETE SET NULL;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE;

--
-- Constraints for table `proposals`
--
ALTER TABLE `proposals`
  ADD CONSTRAINT `proposals_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `members` (`member_id`) ON DELETE SET NULL;

--
-- Constraints for table `repayments`
--
ALTER TABLE `repayments`
  ADD CONSTRAINT `repayments_ibfk_1` FOREIGN KEY (`loan_id`) REFERENCES `loans` (`loan_id`) ON DELETE CASCADE;

--
-- Constraints for table `shares`
--
ALTER TABLE `shares`
  ADD CONSTRAINT `shares_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE SET NULL;

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`proposal_id`) REFERENCES `proposals` (`proposal_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
