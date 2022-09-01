-- MySQL dump 10.13  Distrib 8.0.29, for Linux (x86_64)
--
-- Host: localhost    Database: justchat
-- ------------------------------------------------------
-- Server version	8.0.30-0ubuntu0.20.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `msgid` int NOT NULL AUTO_INCREMENT,
  `msgdata` longtext NOT NULL,
  `sender` int NOT NULL,
  `receiver` int NOT NULL,
  `status` int NOT NULL,
  `date` datetime NOT NULL,
  `threadid` int DEFAULT NULL,
  PRIMARY KEY (`msgid`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'Hiiiii',1,2,1,'2022-08-05 08:55:39',1),(2,'Hlooooo',2,1,1,'2022-08-05 09:02:29',1),(5,'Plzz come fast',1,2,1,'2022-08-05 10:34:14',1),(48,'okkk',2,1,1,'2022-08-17 06:28:52',1),(49,'hh\n',1,2,1,'2022-08-17 08:34:59',1),(53,'PPPP',1,2,1,'2022-08-17 09:58:29',1),(54,'OOOOO',1,3,0,'2022-08-17 10:00:48',5),(55,'Hi Bro',2,1,1,'2022-08-17 10:02:31',1),(56,'Maaaannnn',2,3,0,'2022-08-17 10:03:09',6),(57,'Gud mng',2,4,0,'2022-08-17 10:03:54',7),(58,'Where is u ?',1,4,0,'2022-08-17 10:05:51',8),(59,'AAAAAA',1,4,0,'2022-08-17 11:29:49',8),(60,'Daaaa',2,1,1,'2022-08-17 12:04:15',1),(61,'Doiii',2,3,0,'2022-08-17 12:05:27',6),(62,'123',2,1,1,'2022-08-17 12:06:43',1),(63,'234',2,1,1,'2022-08-17 12:07:11',1),(64,'55555',2,1,1,'2022-08-17 12:10:30',1),(65,'66666',2,1,1,'2022-08-17 12:12:29',1),(66,'web socket sample',2,1,1,'2022-08-18 08:54:43',1),(67,'nokkatte',1,2,1,'2022-08-18 08:55:59',1),(68,'rrr',1,2,1,'2022-08-18 08:57:08',1),(69,'oooo',1,2,1,'2022-08-18 08:59:34',1),(70,'pppp',1,2,1,'2022-08-18 09:00:46',1),(71,'lllll',2,1,1,'2022-08-18 09:01:18',1),(72,'ok',1,2,1,'2022-08-18 09:02:46',1),(73,'mmmm',1,2,1,'2022-08-18 09:06:41',1),(74,'Daaaa',2,1,1,'2022-08-18 09:10:45',1),(75,'Oooooh',2,1,1,'2022-08-18 09:12:08',1),(76,'AAAAhhhh',2,1,1,'2022-08-18 09:12:37',1),(77,'Hiiii',2,1,1,'2022-08-18 09:13:22',1),(78,'Evdeda?',1,2,1,'2022-08-18 09:13:29',1),(79,'Daaa',2,1,1,'2022-08-18 09:16:07',1),(80,'ne evde??',1,2,1,'2022-08-18 09:16:13',1),(81,'ok',1,2,1,'2022-08-18 09:21:53',1),(82,'Vaa',2,1,1,'2022-08-18 09:35:27',1),(83,'DAaa',1,2,1,'2022-08-18 10:39:44',1),(84,'1',1,2,1,'2022-08-18 10:43:42',1),(85,'2',1,2,1,'2022-08-18 10:44:53',1),(86,'3',1,2,1,'2022-08-18 10:45:47',1),(87,'4',1,2,1,'2022-08-18 10:46:36',1),(88,'5',1,2,1,'2022-08-18 10:54:28',1),(89,'6',1,2,1,'2022-08-18 10:55:09',1);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `threads`
--

DROP TABLE IF EXISTS `threads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `threads` (
  `threadid` int NOT NULL AUTO_INCREMENT,
  `sender` int NOT NULL,
  `receiver` int NOT NULL,
  `lastmsg` longtext NOT NULL,
  `date` datetime NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`threadid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `threads`
--

LOCK TABLES `threads` WRITE;
/*!40000 ALTER TABLE `threads` DISABLE KEYS */;
INSERT INTO `threads` VALUES (1,1,2,'6','2022-08-18 10:55:09',1),(5,1,3,'OOOOO','2022-08-17 10:00:48',0),(6,2,3,'Doiii','2022-08-17 12:05:27',0),(7,2,4,'Gud mng','2022-08-17 10:03:54',0),(8,1,4,'AAAAAA','2022-08-17 11:29:49',0);
/*!40000 ALTER TABLE `threads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `image` longtext,
  `gender` int DEFAULT NULL,
  `token` longtext,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Rami','123','mohammed.rami@innovaturelabs.com','http://res.cloudinary.com/ramimohammed/image/upload/v1660188601/JustChat/vuvoh06jfsi3rkk1qr6l.png',0,NULL),(2,'Sahal','12345','sahal@gmail.com','https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png',0,NULL),(3,'Shafi','12345','shafi@gmail.com','https://png.pngtree.com/png-clipart/20200701/original/pngtree-businessman-user-avatar-character-vector-illustration-png-image_5415558.jpg',0,NULL),(4,'Ramshad','12345','ramshad@gmail.com','https://png.pngtree.com/png-clipart/20190924/original/pngtree-vector-user-young-boy-avatar-icon-png-image_4827810.jpg',0,NULL),(8,'Sufu','12345','sufanafathima123@gmail.com','ttttt',1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-09-01 11:33:14
