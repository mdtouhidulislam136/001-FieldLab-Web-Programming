#ifndef SIGNALS_H
#define SIGNALS_H

#include <pqxx/pqxx>
#include <memory>
#include <string>
#include <sstream>
#include <iostream>
#include <vector>
#include <chrono>
#include <ctime>
#include <cmath>
#include <utility>
#include <iomanip>
#include <thread>
#include <mutex>
#include "datapacket.h"
#include "timer.h"
#include "variable.h"

extern std::string dbTimestamp;

std::unique_ptr<pqxx::connection> openConnection(std::unique_ptr<pqxx::connection>&&);
void temperatureGenerator(std::vector<std::unique_ptr<Datapacket>> &temperatureSignals);
double randomDouble(double lowerLimit, double upperLimit);
int getPointsPerWave(const double& signalFrequency = 1.0, const double& samplingRate = 10.0); //Defaults set to 1 kHz => 4 points per wave
int defineIncrement(const double& signalFrequency, const int&numberOfPoints);
void createSineWave(const double& frequency,const double& amplitude, const double& offset, std::vector<std::unique_ptr<Datapacket>>& sineSignals);
void createSquareWave(const double& frequency, std::vector<std::unique_ptr<Datapacket>>& squareSignals);
void createRectangularWave(const double& frequency, double pulseWidth, std::vector<std::unique_ptr<Datapacket>>& rectangularSignals); //pulseWidth percentage as e.g 10% = 0.1
void createTriangularWave(const double& frequency, const double& amplitude, const double& offset, std::vector<std::unique_ptr<Datapacket>>& triangularSignals);
void createSawtoothWave(const double& frequency, const double& amplitude, const bool& signalRamp, std::vector<std::unique_ptr<Datapacket>>& sawToothSignals);
void sender(const std::stringstream&);
std::string toZeroLead(const int value, const unsigned precision);
std::stringstream createSignalStream(const int& numberOfWaves, const double& signalFrequency,std::vector<std::unique_ptr<Datapacket>>& signalVector);
void sendConstantSine();
void sendConstantSquare();
void sendConstantTriangular();
void sendConstantSawtooth();
void sendConstantRectangular();
void sendConstantTemperature();
void sendTemperature();
void sendSine(pqxx::connection&);
void sendSquare(pqxx::connection&);
void sendTriangular(pqxx::connection&);
void sendSawtooth(pqxx::connection&);
void sendRectangular(pqxx::connection&);
void timestampUpdater();

#endif