-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 22, 2021 at 09:41 AM
-- Server version: 10.1.35-MariaDB
-- PHP Version: 7.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `food-factory-app`
--

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE `food` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `cuisine` varchar(100) NOT NULL,
  `ingredients` varchar(100) NOT NULL,
  `lotNumber` varchar(55) NOT NULL,
  `costOfProduction` int(11) NOT NULL,
  `sellingCost` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`id`, `name`, `cuisine`, `ingredients`, `lotNumber`, `costOfProduction`, `sellingCost`, `created_at`) VALUES
(1, 'Onion Uttapam', 'Uttapam', 'Onion', 'f0_01', 50, 80, '2021-03-21 08:15:51'),
(5, 'Rova with Ghee Roast', 'Roast', 'ghee ', 'f0_04', 80, 130, '2021-03-22 08:40:30'),
(6, 'Pongal ( Or ) Kichadi', 'Pongal', 'ghee ', 'f0_010', 50, 90, '2021-03-21 01:47:24'),
(7, 'Sambar Idli', 'Sambar Idli', 'Sambar ', 'f0_011', 30, 70, '2021-03-21 01:47:24'),
(8, 'Chicken Fried Rice', 'Rice', 'chicken ', 'f0_012', 90, 150, '2021-03-21 01:47:24'),
(9, 'Chicken Noodles', 'Noodles', 'chicken ', 'f0_013', 60, 130, '2021-03-21 01:47:24');

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `id` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `lotNumber` varchar(55) NOT NULL,
  `availableQuantity` int(11) NOT NULL,
  `thresholdQuantity` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `vendorName` varchar(55) NOT NULL,
  `vendorEmail` varchar(55) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`id`, `name`, `lotNumber`, `availableQuantity`, `thresholdQuantity`, `price`, `vendorName`, `vendorEmail`, `created_at`) VALUES
(1, 'Egg Combo 13', 'ing_091', 90, 30, 20, 'kk Raj', 'raj@kkhotel.com', '2021-03-21 06:35:25'),
(3, 'Ghee Roast', 'ing_08', 50, 10, 90, 'RR Hotel', 'rr@rrhotel.com', '2021-03-21 00:56:57');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderNum` int(11) NOT NULL,
  `status` varchar(55) NOT NULL,
  `orderDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `dateOfdelivery` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modeOfTransport` varchar(55) NOT NULL,
  `customerName` varchar(55) NOT NULL,
  `customerPhone` int(12) NOT NULL,
  `customerAddress` text NOT NULL,
  `customerPincode` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`orderNum`, `status`, `orderDate`, `dateOfdelivery`, `modeOfTransport`, `customerName`, `customerPhone`, `customerAddress`, `customerPincode`, `created_at`) VALUES
(5011, 'confirmed', '2021-03-21 22:53:09', '2021-03-22 08:22:41', 'two wheeler', 'Mariya Singh', 2147483647, 'no:55, TTK Road, Chennai', 600018, '2021-03-21 22:53:09'),
(5012, 'confirmed', '2021-03-21 23:01:08', '2021-03-22 08:22:41', 'two wheeler', 'Mariya Singh', 2147483647, 'no:55, TTK Road, Chennai', 600018, '2021-03-21 23:01:08'),
(5013, 'confirmed', '2021-03-21 23:03:18', '2021-03-22 08:22:41', 'two wheeler', 'Mariya Singh', 2147483647, 'no:55, TTK Road, Chennai', 600018, '2021-03-21 23:03:18'),
(5014, 'confirmed', '2021-03-21 23:04:03', '2021-03-22 08:22:41', 'two wheeler', 'Mariya Singh', 2147483647, 'no:55, TTK Road, Chennai', 600018, '2021-03-21 23:04:03'),
(5015, 'confirmed', '2021-03-21 23:04:42', '2021-03-22 08:22:41', 'two wheeler', 'Mariya Singh', 2147483647, 'no:55, TTK Road, Chennai', 600018, '2021-03-21 23:04:42'),
(5016, 'confirmed', '2021-03-22 00:33:37', '2021-03-22 08:22:41', 'two wheeler', 'Mariya Singh', 2147483647, 'no:55, TTK Road, Chennai', 600018, '2021-03-22 00:33:37'),
(5017, 'confirmed', '2021-03-22 02:56:44', '2021-03-22 08:22:41', 'two wheeler', 'admin', 0, '', 0, '2021-03-22 02:56:44');

-- --------------------------------------------------------

--
-- Table structure for table `order_detail`
--

CREATE TABLE `order_detail` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL COMMENT 'Food id as Item_id',
  `item_qty` int(11) NOT NULL,
  `item_price` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `ingredent_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_detail`
--

INSERT INTO `order_detail` (`id`, `order_id`, `user_id`, `item_id`, `item_qty`, `item_price`, `price`, `ingredent_id`) VALUES
(36, 5010, 11, 5, 2, 900, 1800, 0),
(37, 5010, 11, 6, 2, 90, 180, 0),
(38, 5010, 11, 7, 10, 70, 700, 0),
(54, 5016, 13, 5, 2, 900, 1800, 0),
(55, 5016, 13, 6, 2, 90, 180, 0),
(56, 5016, 13, 7, 10, 70, 700, 0),
(57, 5017, 1, 9, 2, 130, 260, 0),
(58, 5017, 1, 6, 2, 90, 180, 0),
(59, 5017, 1, 5, 10, 130, 1300, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(55) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(55) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(55) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `pincode` int(11) NOT NULL,
  `phoneNo` int(12) NOT NULL,
  `profile` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('0','1') COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastLogin_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `token`, `role`, `address`, `pincode`, `phoneNo`, `profile`, `status`, `lastLogin_at`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@gmail.com', '$2b$10$9ozdlIBQ3a2SJ24j/VqHEe.l4myPUMRc9ReN35kFBp8XcdtNLSLMy', 'admin', 'admin', '', 0, 0, '', '1', '2021-03-22 08:17:47', NULL, '2021-03-22 02:47:47'),
(10, 'ravi', 'ranaas@wee.com', '$2b$10$2JjtBYykbDRUkiQdMIezZu.R/h0y1cLFX1YDEweqxeu7dEyBb9SWi', NULL, 'customer', '', 0, 0, '', '1', '2021-03-20 16:13:48', '2021-03-19 22:20:35', '2021-03-20 10:43:48'),
(11, 'kumar', 'kumar@wee.com', '$2b$10$naNB4ry9fjDLWJSVZkmzPupBTka/6v50utna.yqahhIzg8Wg3kiDy', NULL, 'customer', '', 0, 0, '', '1', '2021-03-21 21:27:26', '2021-03-20 01:31:55', '2021-03-20 01:31:55'),
(12, 'raj', 'raj@gmail.com', '$2b$10$4R7kkCiDDQ/H8SMehcneCOFjwKf7eooPX/XNk5XTRODhNNDmWVtXa', NULL, 'customer', 'no:55, TTK Road, CBE', 641002, 2147483647, 'profile.jpg', '0', '2021-03-22 03:37:44', '2021-03-21 22:05:49', '2021-03-21 22:05:49'),
(13, 'Mariya Singh', 'mariya@gmail.com', '$2b$10$XsP3VlDmq08i7cTV06pCUema0IsC/JaoZgHGwxIrJK8kQYlD0Xk9q', NULL, 'customer', 'no:55, TTK Road, Chennai', 600018, 2147483647, 'profile.jpg', '1', '2021-03-22 02:40:13', '2021-03-21 22:08:45', '2021-03-21 22:08:45'),
(15, 'hari', 'hari@gmail.com', '$2b$10$Tob7S.dTGfr09Zjrz2EtZOs9NmtkzpXcEvn7ICdoPol0qpl2cH7O.', NULL, 'customer', 'no:55, TTK Road, Chennai', 600018, 2147483647, 'profile.jpg', '1', '2021-03-22 08:10:58', '2021-03-22 02:40:02', '2021-03-22 02:40:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `food`
--
ALTER TABLE `food`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lotNumber` (`lotNumber`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lotNumber` (`lotNumber`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderNum`),
  ADD UNIQUE KEY `id` (`orderNum`);

--
-- Indexes for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `food`
--
ALTER TABLE `food`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderNum` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5018;

--
-- AUTO_INCREMENT for table `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
