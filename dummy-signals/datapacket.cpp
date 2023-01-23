#include "datapacket.h"

Datapacket::Datapacket()
{
    m_city = "-";
    m_place = "-";
    m_machine = "-";
    m_machineType = "-";
    m_machineNumber = 1;
    m_machineModule = "-";
    m_signalName = "-";
    m_signalNumber = 3;
    m_minValue = 0;
    m_maxValue = 0;
    m_signalValue;
    m_signalUnit = "-";
}

Datapacket::Datapacket(std::string city, std::string place, std::string machine, std::string machineType, int machineNumber, std::string machineModule, std::string signalName, int signalNumber, double minValue, double maxValue, double signalValue, std::string signalUnit)
{
    m_city = city;
    m_place = place;
    m_machine = machine;
    m_machineType = machineType;
    m_machineNumber = machineNumber;
    m_machineModule = machineModule;
    m_signalName = signalName;
    m_signalNumber = signalNumber;
    m_minValue = minValue;
    m_maxValue = maxValue;
    m_signalValue = signalValue;
    m_signalUnit = signalUnit;
}

// Datapacket::~Datapacket(){
//     std::cout << "Datapacket deleted." << std::endl;
// }

/********************************************************************************************************
 *  The same random function used elsewhere has been baked into the Datapacket class making it possible
 *  to create signalobject which generates it own random value.
 *******************************************************************************************************/
double Datapacket::createsignalValue()
{
    std::random_device random_device;
    std::mt19937 random_engine(random_device());
    std::uniform_real_distribution<double> distribution(this->m_minValue,this->m_maxValue);
 
    return distribution(random_engine);
}

Temperature::Temperature(std::string place)
{
    m_city = "Tampere";
    m_place = place;
    m_machine = "WeatherStation";
    m_machineType = "Thermometer";
    m_machineModule = "Temperature_interior";
    m_signalName = "Temperature";
    m_signalNumber = 15;
    m_minValue = 16.0;
    m_maxValue = 30.0;
    m_signalValue = this->createsignalValue();
    m_signalUnit = "Celsius";
}

Temperature::Temperature(std::string city, std::string place)
{
    m_city = city;
    m_place = place;
    m_machine = "WeatherStation";
    m_machineType = "Thermometer";
    m_machineModule = "Temperature";
    m_signalName = "Temperature";
    m_signalNumber = 10;
    m_minValue = 0.0;
    m_maxValue = 30.0;
    m_signalValue = this->createsignalValue();
    m_signalUnit = "Celsius";
}

Temperature::Temperature(std::string city, std::string place, std::string module)
{
    m_city = city;
    m_place = place;
    m_machine = "WeatherStation";
    m_machineType = "Thermometer";
    m_machineModule = module;
    m_signalName = "Temperature";
    m_signalNumber = 35;
    m_minValue = 0.0;
    m_maxValue = 30.0;
    m_signalValue = this->createsignalValue();
    m_signalUnit = "Celsius";
}

Temperature::Temperature(std::string city, std::string place, std::string module, double minValue, double maxValue)
{
    m_city = city;
    m_place = place;
    m_machine = "WeatherStation";
    m_machineType = "Thermometer";
    m_machineModule = module;
    m_signalName = "Temperature";
    m_signalNumber = 1;
    m_minValue = minValue;
    m_maxValue = maxValue;
    m_signalValue = this->createsignalValue();
    m_signalUnit = "Celsius";
}

Temperature::Temperature(std::string city, std::string place, int signalNumber, double minValue, double maxValue)
{
    m_city = city;
    m_place = place;
    m_machine = "WeatherStation";
    m_machineType = "Thermometer";
    m_machineNumber = 1;
    m_machineModule = "XeTherm-001";
    m_signalName = "Temperature";
    m_signalNumber = signalNumber;
    m_minValue = minValue;
    m_maxValue = maxValue;
    m_signalValue = this->createsignalValue();
    m_signalUnit = "Celcius";
}

Sine::Sine(double signalValue)
{
    m_city = "Tampere";
    m_place = "Kauppi";
    m_machine = "Charger_001";
    m_machineType = "Sinewave";
    m_machineModule = "Tesla 3";
    m_signalName = "Voltage";
    m_signalNumber = 1;
    m_signalValue = signalValue;
    m_signalUnit = "V"; 
}

Square::Square(bool signalState)
{
    m_city = "Tampere";
    m_place = "Hervanta";
    m_machine = "Coffeepot_teachers";
    m_machineType = "Squarewave";
    m_machineModule = "Taiwan";
    m_signalName = "Power";
    m_minValue = setMinValue(signalState);
    m_maxValue = setMaxValue(signalState);
    m_signalNumber = 1;
    m_signalValue = this->createsignalValue();
    m_signalUnit = "W";
    m_signalState = signalState;
}

/*****************************************************************************************************
 *  setValue-functions set min and max values for the object, which are basis for the random value.
 ****************************************************************************************************/
double Square::setMinValue(bool state)
{
    if (state == true)
    { 
        return 0.985;
    }
    else
    {
        return -0.015;
    }
}

double Square::setMaxValue(bool state)
{
    if (state == true)
    {
        return 1.015; 
    }
    else
    {
        return 0.015;
    }
    
}

Rectangular::Rectangular(bool state, double pulseWidth) : Square(state)
{
    
    m_pulseWidth = pulseWidth;
    m_city = "Tampere";
    m_place = "Hervanta";
    m_machine = "Cyberdyne";
    m_machineType = "Rectangular";
    m_machineModule = "USA";
    m_signalName = "GPS";
    m_signalNumber = 1;
    m_signalUnit = "mV";
}

Triangular::Triangular(double maxValue, double signalValue)
{
    m_city = "Tampere";
    m_place = "Hervanta";
    m_machine = "Apnea Monitore";
    m_machineType = "Triangularwave";
    m_machineModule = "FIN";
    m_maxValue = maxValue;
    m_signalName = "Volume";
    m_signalNumber = 1;
    m_signalUnit = "cm3";
    m_signalValue = signalValue;
}

Sawtooth::Sawtooth(double maxValue, double signalValue)
{
    m_city = "Tampere";
    m_place = "Hervanta";
    m_machine = "Oscilloscope";
    m_machineType = "Sawtoothwave";
    m_machineModule = "NOR";
    m_signalName = "Voltage";
    m_signalNumber = 1;
    m_signalUnit = "V";
    m_maxValue = maxValue;
    m_signalValue = signalValue;
}