#ifndef DATAPACKET
#define DATAPACKET

#include <string>
#include <iostream>
#include <random>

/*******************************************************************************************************
 *  The class based on the assumed data model. Every signal possible could be contructed with this,
 *  but for ease of use, several derivative classes have been contructed.
 ******************************************************************************************************/
class Datapacket{
    public:
        std::string m_city;
        std::string m_place;
        std::string m_machine;
        std::string m_machineType;
        int m_machineNumber;
        std::string m_machineModule;
        std::string m_signalName;
        int m_signalNumber;
        double m_minValue;
        double m_maxValue;
        double m_signalValue;
        std::string m_signalUnit;
        Datapacket();
        Datapacket(std::string city, std::string place, std::string machine, std::string machineType, 
            int machineNumber, std::string machineModule, std::string signalName, int signalNumber, 
            double minValue, double maxValue, double signalValue, std::string signalUnit);
        // ~Datapacket();
        double createsignalValue();
};

class Temperature : public Datapacket{
    public:
        Temperature(std::string place);
        Temperature(std::string city, std::string place);
        Temperature(std::string city, std::string place, std::string module);
        Temperature(std::string city, std::string place, std::string module, double minValue, double maxValue);
        Temperature(std::string city, std::string place, int signalNumber, double minValue, double maxValue);
};

class Sine : public Datapacket{
    public:
        Sine(double signalValue);
};

class Square : public Datapacket{
    public:
        bool m_signalState;
        Square(bool signalState);
        double setMinValue(bool signalState);
        double setMaxValue(bool signalState);
};

class Rectangular : public Square{
    public:
        double m_pulseWidth;
        Rectangular(bool signalState, double pulseWidth);
};

class Triangular : public Datapacket{
    public:
        Triangular(double maxValue, double signalValue);
};

class Sawtooth : public Datapacket{
    public:
        Sawtooth(double maxValue, double signalValue);
};

#endif

