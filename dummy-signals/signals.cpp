#include "signals.h"

/***************************************************************************************************************
*    The function openConnection uses the libpgxx library 6.4 to create a connection with databaseand the version
*    was chosen because it was the one available from ubuntu repositories. The connection is wrapped into a 
*    smartpointer which is then handed back to the function opening the connection. To learn more about the 
*    library and its usage visit https://libpqxx.readthedocs.io/en/6.4/index.html .
****************************************************************************************************************/
std::unique_ptr<pqxx::connection> openConnection(std::unique_ptr<pqxx::connection>&& dbConnection)
{
    try {
        dbConnection = std::make_unique<pqxx::connection>("dbname = cxx_client user = cxx_client password = cxx_client \
        hostaddr = 172.16.101.131 port = 5432");
        if (dbConnection->is_open()) {
            std::cout << "Connection open." << std::endl;
        } 
        else {
          std::cout << "Can't open database." << std::endl;
        }
    }
    catch (const std::exception &e) {
      std::cerr << e.what() << std::endl;
    }
    
    return std::move(dbConnection);
}

/**************************************************************************************************************
*    The sendConstant functions adds the sleep period, so that the fictious timestamps are not totally
*    messed up. The amount of milliseconds is estimated based on the signalfrequency used, for which the 
*    default value has been set to 1 kHz. To be used with threads.
***************************************************************************************************************/
void sendConstantSine()
{
    int insertionInterval = 1000;   
    static thread_local std::unique_ptr<pqxx::connection> dbConnection;
    dbConnection = openConnection(std::move(dbConnection));

    while(true)
    {
        sendSine(*dbConnection);
        std::this_thread::sleep_for(std::chrono::milliseconds(insertionInterval));
    }
    
}

void sendConstantSquare()
{
    int insertionInterval = 1000;
    static thread_local std::unique_ptr<pqxx::connection> dbConnection;
    dbConnection = openConnection(std::move(dbConnection));
    while(true)
    {
        sendSquare(*dbConnection);
        std::this_thread::sleep_for(std::chrono::milliseconds(insertionInterval));
    }
    
}

void sendConstantTriangular()
{
    int insertionInterval = 1000;
    static thread_local std::unique_ptr<pqxx::connection> dbConnection;
    dbConnection = openConnection(std::move(dbConnection));
    while(true)
    {
        sendTriangular(*dbConnection);
        std::this_thread::sleep_for(std::chrono::milliseconds(insertionInterval));
    }
    
}

void sendConstantSawtooth()
{
    int insertionInterval = 1000;
    static thread_local std::unique_ptr<pqxx::connection> dbConnection;
    dbConnection = openConnection(std::move(dbConnection));
    while(true)
    {
        sendSawtooth(*dbConnection);
        std::this_thread::sleep_for(std::chrono::milliseconds(insertionInterval));
    }

}

void sendConstantRectangular()
{
    int insertionInterval = 1000;
    static thread_local std::unique_ptr<pqxx::connection> dbConnection;
    dbConnection = openConnection(std::move(dbConnection));
    while(true)
    {
        sendRectangular(*dbConnection);
        std::this_thread::sleep_for(std::chrono::milliseconds(insertionInterval));
    }
}

void sendConstantTemperature()
{
    std::vector<std::unique_ptr<Datapacket>> temperatureSignals;
    temperatureGenerator(temperatureSignals);
    std::stringstream temperatureStream;
    int precision = 2;
    std::string baseTime = dbTimestamp;
    std::cout << baseTime;
    baseTime.erase(17, 2);
    std::string insertionTime;
    static int seconds = 0;
    int timeIncrement;
    
    timeIncrement = 2;

    for (auto &signal : temperatureSignals){
        insertionTime = baseTime + toZeroLead(seconds, precision);
        std::cout << baseTime << " " << insertionTime <<  std::endl;
        temperatureStream << "INSERT INTO Fieldlab VALUES('"<<signal->m_city<<"','"<<signal->m_place<<"','"<<signal->m_machine<<"','"<<signal->m_machineType<<"','"<<signal->m_machineNumber<<"','"<<signal->m_machineModule<<"','"<<signal->m_signalName<<"','"<<signal->m_signalNumber<<"','"<<signal->m_signalValue<<"','"<<signal->m_signalUnit<<"', '"<<insertionTime<<"');";
        seconds += timeIncrement;

        if(seconds > 59){
            baseTime = dbTimestamp;
            baseTime.erase(17, 2);
            seconds = 0;
            }
    }

    sender(temperatureStream);
}

/******************************************************************************************************************
*    The sendTemperature-functions differs from the others because it lacks the timestamp. Instead it relies on
*    the databases default timestamp, which the database adds to every signal lacking them. But as with the other
*    send-functions, the timestamp could be added to this signal within the function.
*******************************************************************************************************************/
void sendTemperature()
{
    std::vector<std::unique_ptr<Datapacket>> temperatureSignals;
    temperatureGenerator(temperatureSignals);
    
    std::stringstream temperatureStream;

    for (auto &signal : temperatureSignals){
        temperatureStream << "INSERT INTO Fieldlab VALUES('"<<signal->m_city<<"','"<<signal->m_place<<"','"<<signal->m_machine<<"','"<<signal->m_machineType<<"','"<<signal->m_machineNumber<<"','"<<signal->m_machineModule<<"','"<<signal->m_signalName<<"','"<<signal->m_signalNumber<<"','"<<signal->m_signalValue<<"','"<<signal->m_signalUnit<<"');";
    }

    sender(temperatureStream);

}

/*********************************************************************************************************************
*    The send-functions transform the created signal vectors into streams that can be transferred to the actual
*    sender for transmission. Number of waves are inserted at once into the stream in order to simplify the
*    creation of the fake timestamps.
**********************************************************************************************************************/
void sendSine(pqxx::connection& dbConnection)
{
    int numberOfWaves = 100;
    std::vector<std::unique_ptr<Datapacket>> sineSignals;
    std::stringstream sineStream;
    double frequency = 0.1;
    double amplitude = 10.0;
    double offset = randomDouble(-5.0, 5.0);

    createSineWave(frequency, amplitude, offset, sineSignals);
    sineStream = createSignalStream(numberOfWaves, frequency, sineSignals);

    pqxx::work W(dbConnection);

    try {
        pqxx::result res = W.exec(sineStream.str());
        W.commit();
        std::cout << "Sine succeeded." << std::endl;
    }
    catch(const std::exception &es){
        std::cerr << es.what() << std::endl;
        std::cout << "Exception on statement:["<<sineStream.str()<<"]\n";
    }
}

void sendSquare(pqxx::connection& dbConnection)
{
    int numberOfWaves = 100;
    std::vector<std::unique_ptr<Datapacket>> squareSignals;
    std::stringstream squareStream;
    double frequency = 0.5;

    createSquareWave(frequency, squareSignals);
    squareStream = createSignalStream(numberOfWaves, frequency, squareSignals);

    pqxx::work W(dbConnection);

    try {
        pqxx::result res = W.exec(squareStream.str());
        W.commit();
        std::cout << "Square succeeded." << std::endl;
    }
    catch(const std::exception &es){
        std::cerr << es.what() << std::endl;
        std::cout << "Exception on statement:["<<squareStream.str()<<"]\n";
    }
}

void sendTriangular(pqxx::connection& dbConnection)
{
    int numberOfWaves = 100;
    std::vector<std::unique_ptr<Datapacket>> triangularSignals;
    std::stringstream triangularStream;
    double frequency = 0.05;
    double amplitude = 5.0;
    double offset = randomDouble(-5.0, 5.0);

    createTriangularWave(frequency, amplitude, offset, triangularSignals);
    triangularStream = createSignalStream(numberOfWaves, frequency, triangularSignals);

    pqxx::work W(dbConnection);

    try {
        pqxx::result res = W.exec(triangularStream.str());
        W.commit();
        std::cout << "Triangular succeeded." << std::endl;
    }
    catch(const std::exception &es){
        std::cerr << es.what() << std::endl;
        std::cout << "Exception on statement:["<<triangularStream.str()<<"]\n";
    }
}

void sendSawtooth(pqxx::connection& dbConnection)
{
    int numberOfWaves = 100;
    std::vector<std::unique_ptr<Datapacket>> sawtoothSignals;
    std::stringstream sawtoothStream;
    double frequency = 0.2;
    double amplitude = 20.0;
    bool ramp = true;

    createSawtoothWave(frequency, amplitude, ramp, sawtoothSignals);
    sawtoothStream = createSignalStream(numberOfWaves, frequency, sawtoothSignals);

    pqxx::work W(dbConnection);

    try {
        pqxx::result res = W.exec(sawtoothStream.str());
        W.commit();
        std::cout << "Sawtooth succeeded." << std::endl;
    }
    catch(const std::exception &es){
        std::cerr << es.what() << std::endl;
        std::cout << "Exception on statement:["<<sawtoothStream.str()<<"]\n";
    }
}

void sendRectangular(pqxx::connection& dbConnection)
{
    int numberOfWaves = 100;
    std::vector<std::unique_ptr<Datapacket>> rectangularSignals;
    std::stringstream rectangularStream;
    double frequency = 0.1;
    double amplitude = 20.0;

    createRectangularWave(frequency, 0.1, rectangularSignals);
    rectangularStream = createSignalStream(numberOfWaves, frequency, rectangularSignals);

    pqxx::work W(dbConnection);

    try {
        pqxx::result res = W.exec(rectangularStream.str());
        W.commit();
        std::cout << "Rectangular succeeded." << std::endl;
    }
    catch(const std::exception &es){
        std::cerr << es.what() << std::endl;
        std::cout << "Exception on statement:["<<rectangularStream.str()<<"]\n";
    }
}

/*****************************************************************************************************************
 *  The createSignalStream function transforms the created signals into streams and adds the fake timestamps 
 *  into it. The fake timestamps are based on databases internal time, which is altered to reflect the frequency of 
 *  the signal.
 ****************************************************************************************************************/
std::stringstream createSignalStream(const int& numberOfWaves, const double& signalFrequency,std::vector<std::unique_ptr<Datapacket>>& signalVector)
{
    std::stringstream signalStream;
    int precision = 6;
    std::string baseTime = dbTimestamp;
    std::string insertionTime;
    static int microSeconds = 0;
    int timeIncrement;
    int counter = 1;
    
    int divider = getPointsPerWave(signalFrequency);
    timeIncrement = defineIncrement(signalFrequency, divider);
    
    baseTime += ".";

    while (counter != numberOfWaves)
    {
        for (auto &signal : signalVector){
        insertionTime = baseTime + toZeroLead(microSeconds, precision);
        signalStream << "INSERT INTO Fieldlab VALUES('"<<signal->m_city<<"','"<<signal->m_place<<"','"<<signal->m_machine<<"','"<<signal->m_machineType<<"','"<<signal->m_machineNumber<<"','"<<signal->m_machineModule<<"','"<<signal->m_signalName<<"','"<<signal->m_signalNumber<<"','"<<signal->m_signalValue<<"','"<<signal->m_signalUnit<<"', '"<<insertionTime<<"');";
        microSeconds += timeIncrement;

        if(microSeconds > 999999){
            baseTime = dbTimestamp;
            baseTime += ".";
            microSeconds = 0;
            }
        }
        counter++;
    }

    return signalStream;

}

/*******************************************************************************************************************
 *  The temperatureGenerator simply makes unique pointers to signal objects and pushes those pointers into a
 *  vector of smartpointers, which are used for simplicity and fire-and-forget nature.
 *******************************************************************************************************************/
void temperatureGenerator(std::vector<std::unique_ptr<Datapacket>> &temperatureSignals)
{
    temperatureSignals.push_back(std::make_unique<Temperature>("Helsinki", "Kolera-allas", 1, 10.0, 16.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Helsinki", "Esplanadi", 1, 12.0, 19.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Helsinki", "Yliopisto", 1, 10.0, 16.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Helsinki", "Kolera-allas", 2, 19.0, 26.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Helsinki", "Esplanadi", 2, 22.0, 39.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Helsinki", "Yliopisto", 2, 18.0, 36.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Helsinki", "Kolera-allas", 3, 8.0, 16.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Helsinki", "Esplanadi", 3, 2.0, 9.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Helsinki", "Yliopisto", 3, 1.0, 6.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Tampere", "Kauppi", 1, 13.0, 15.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Tampere", "Hervanta", 1, 13.0, 15.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Tampere", "Yliopisto", 1, 15.0, 16.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Tampere", "Kauppi", 2, 19.0, 22.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Tampere", "Hervanta", 2, 22.0, 29.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Tampere", "Yliopisto", 2, 8.0, 16.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Tampere", "Kauppi", 3, 8.0, 56.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Tampere", "Hervanta", 3, 2.0, 93.9));
    temperatureSignals.push_back(std::make_unique<Temperature>("Tampere", "Yliopisto", 3, 1.0, 63.9));
}

/**********************************************************************************************************************
 *  Random function to create temperature values and variable amplitudes etc. Chosen instead of srand due the modern
 *  nature.
 *********************************************************************************************************************/
double randomDouble(double lowerLimit, double upperLimit)
{
    std::random_device random_device;
    std::mt19937 random_engine(random_device());
    std::uniform_real_distribution<double> distribution(lowerLimit, upperLimit);
 
    return distribution(random_engine);
}

/***********************************************************************************************************************
 *  getPointsPerWave calculates the amount datapoints for every signal wave. Made with the assumption that there should
 *  be limits to the amount of datapoints per signal - which haven't been tested yet.
 **********************************************************************************************************************/
int getPointsPerWave(const double& signalFrequency, const double& samplingRate)
{
    if (signalFrequency < 1.0)
    {
        return 4;
    }
    return static_cast<int>(signalFrequency*samplingRate);
}

/************************************************************************************************************************
 *  definedIncrement to aid in creation of the fake timestamps. Higher the signal frequency, the smaller the addition
 *  in the fake timestamp.
 ***********************************************************************************************************************/
int defineIncrement(const double& signalFrequency, const int&numberOfPoints)
{
    return static_cast<int>(1000000 / (signalFrequency*1000*numberOfPoints));
}

/*************************************************************************************************************************
 *  createWave-functions calculates the signal value based on the mathematical functions, the parameters and small 
 *  random element a.k.a "tremor".
 ************************************************************************************************************************/
void createSineWave(const double& frequency, const double& amplitude, const double& offset, std::vector<std::unique_ptr<Datapacket>>& sineSignals)
{

    double degrees{0.0};
    double tremor;
    int divider = getPointsPerWave(frequency);
    ++divider;
    double degreeBetweenPoints = (360.0 / divider);

    while (degrees <= 360.0){
        double radians = std::sin(degrees*M_PI/180);
        tremor = randomDouble(-0.005, 0.005);
        sineSignals.push_back(std::make_unique<Sine>(amplitude * radians + offset + tremor));
        degrees += degreeBetweenPoints;
    }

}

void createSquareWave(const double& frequency, std::vector<std::unique_ptr<Datapacket>>& squareSignals)
{
    bool state = true;
    int dropOff = getPointsPerWave(frequency);

    for (auto i = 0 ; i < dropOff; ++i){
         squareSignals.push_back(std::make_unique<Square>(state));
         if (i == (dropOff/2 - 1)) state = false;
    }
}

void createRectangularWave(const double& frequency, double pulseWidth, std::vector<std::unique_ptr<Datapacket>>& rectangularSignals)
{
    //Can be used to create pulse waveform
    int numberOfSignals;
    bool state = true;

    if (frequency >= 10.0) numberOfSignals = getPointsPerWave(frequency); //Remember to note this when creating timestamp.
    else numberOfSignals = 10;

    int dropOff = pulseWidth * numberOfSignals;

    for (auto i = 0 ; i < numberOfSignals; ++i){
         rectangularSignals.push_back(std::make_unique<Rectangular>(state, pulseWidth));
         if (i == dropOff -1) state = false;
    }
}

void createTriangularWave(const double& frequency, const double& amplitude, const double& offset, std::vector<std::unique_ptr<Datapacket>>& triangularSignals)
{
    double degrees = 0.0;
    double radians;
    double triangularSignalValue;
    double tremor;
    int divider = getPointsPerWave(frequency);
    double degreeBetweenPoints = (360.0 / divider);

    while (degrees <= 360.0){
        radians = std::sin(degrees*M_PI/180);
        tremor = randomDouble(-0.005, 0.005);
        triangularSignalValue = (2*amplitude/M_PI)*asin(sin(2*radians));    
        triangularSignalValue += tremor;
        triangularSignalValue += offset;
        triangularSignals.push_back(std::make_unique<Triangular>(amplitude, triangularSignalValue));
        degrees += degreeBetweenPoints;
    }
}

void createSawtoothWave(const double& frequency, const double& amplitude, const bool& signalRamp, std::vector<std::unique_ptr<Datapacket>>& sawToothSignals)
{
    double tremor;
    int dropOff = getPointsPerWave(frequency);

    for (int i = 0 ; i < dropOff ; ++i){
        tremor = randomDouble(-0.005, 0.005);

        if (signalRamp){
            sawToothSignals.push_back(std::make_unique<Sawtooth>(amplitude, (amplitude/(dropOff-1) * i + tremor)));
        }
        else{
            sawToothSignals.push_back(std::make_unique<Sawtooth>(amplitude, (amplitude - (amplitude/(dropOff - 1) * i + tremor))));
        }
    }
}
/**********************************************************************************************************************
 *  sender-function take the given stream, opens a connection to the database and inserts the content into db.
 *********************************************************************************************************************/
void sender(const std::stringstream& signalStream)
{
    std::unique_ptr<pqxx::connection> dbConnection;
    dbConnection = openConnection(std::move(dbConnection));

    pqxx::work W(*dbConnection);

    try {
        pqxx::result res = W.exec(signalStream.str());
        W.commit();
        std::cout << "Insertion succeeded." << std::endl;
    }
    catch(const std::exception &es){
        std::cerr << es.what() << std::endl;
        std::cout << "Exception on statement:["<<signalStream.str()<<"]\n";
    }

}

void timestampUpdater()
{
    static thread_local std::unique_ptr<pqxx::connection> dbConnection;
    dbConnection = openConnection(std::move(dbConnection));

    while(true)
    {
        pqxx::work W(*dbConnection);
        pqxx::result r;

        try {
            r = W.exec("SELECT DATE_TRUNC('minutes', NOW())");
            W.commit();
        }
        catch(const std::exception &es){
            std::cerr << es.what() << std::endl;
        }

        dbTimestamp = r[0][0].c_str();
        dbTimestamp.erase(19, 3);
        
        std::this_thread::sleep_for(std::chrono::milliseconds(1000));
    }
}

/***************************************************************************************************************************
 *  Add zeros to the fakestamps.
 **************************************************************************************************************************/
std::string toZeroLead(const int value, const unsigned precision)
{
     std::ostringstream oss;
     oss << std::setw(precision) << std::setfill('0') << value;
     return oss.str();
}
