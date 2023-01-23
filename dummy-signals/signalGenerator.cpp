#include "signals.h"

std::string dbTimestamp;

int main(int argc, char* argv[])
{   
    std::thread thread1(timestampUpdater);
    thread1.detach();
    // std::thread thread2(sendConstantTriangular);
    // thread2.detach();
    // std::thread thread3(sendConstantSquare);
    // thread3.detach();
    // std::thread thread4(sendConstantSine);
    // thread4.detach();
    // std::thread thread5(sendConstantSawtooth);
    // thread5.detach();
    // std::thread thread6(sendConstantRectangular);
    // thread6.detach();
    // std::thread thread7(sendConstantTemperature);
    // thread7.detach();
    
    Timer timer;
    timer.start();
    double temperatureTimer = 1.0;

    while(true)
    {
        if (timer.elapsedMinutes() == temperatureTimer){
            sendConstantTemperature();
            temperatureTimer += 1.0;
        }
    }

    return 0;
}