-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema library_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema library_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `library_db` DEFAULT CHARACTER SET utf8 ;
USE `library_db` ;

-- -----------------------------------------------------
-- Table `library_db`.`ACCOUNT`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `library_db`.`ACCOUNT` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `EMAIL` VARCHAR(45) NULL,
  `FIRST_NAME` VARCHAR(45) NULL,
  `LAST_NAME` VARCHAR(100) NULL,
  `ADDRESS` VARCHAR(45) NULL,
  `PHONE_NUMBER` CHAR(10) NULL,
  `HASH` CHAR(160) NULL,
  `ADMIN` TINYINT NULL DEFAULT 0,
  `LOGGED_IN` TINYINT NULL DEFAULT 0,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
