import { requestNotificationPermission, notifyUser } from "../utils/notifications";
import { useState, useEffect, useRef } from "react";

const DEFAULT_POMODORO_TIME = 25 * 60;

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_POMODORO_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getMinutes = (seconds: number) => Math.floor(seconds / 60);

  const toggleTimer = (): void => {
    if (isRunning) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
    } else {
      requestNotificationPermission();
      setIsRunning(true);
    }
  };

  const resetTimer = (): void => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeLeft(DEFAULT_POMODORO_TIME);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime: number) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            notifyUser("🎉 Pomodoro Concluído!");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft]);

  const progressPercentage: number = ((DEFAULT_POMODORO_TIME - timeLeft) / (DEFAULT_POMODORO_TIME)) * 100;

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border-2 bg-100 p-12 text-center shadow-xl">
        <div className="relative mb-8">
          <div className="text-gray-800 mb-4 font-outfit text-6xl font-bold">
            {formatTime(timeLeft)}
          </div>

          <div className="relative mx-auto mb-6 h-48 w-48">
            <svg
              className="h-48 w-48 -rotate-90 transform"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#87B091"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#dc2626"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${
                  2 * Math.PI * 45 * (1 - progressPercentage / 100)
                }`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-600 text-sm font-medium">
                {timeLeft === 0
                  ? "🎉 Concluído!"
                  : isRunning
                  ? "⏰ Trabalhando..."
                  : "⏸️ Pausado"}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-center gap-4">
          <button
            onClick={toggleTimer}
            disabled={timeLeft === 0}
            className={`px-8 py-3 rounded-full font-semibold text-white hover:bg-700 transition-all duration-200 transform hover:scale-105 ${
              timeLeft === 0
                ? "bg-400 cursor-not-allowed"
                : isRunning
                ? "bg-500 shadow-lg"
                : "bg-600 shadow-lg"
            }`}
          >
            {timeLeft === 0 ? "Finalizado" : isRunning ? "Pausar" : "Iniciar"}
          </button>

          <button
            onClick={resetTimer}
            className="transform rounded-full bg-red px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-redHover"
          >
            Reset
          </button>
        </div>

        <div className="text-gray-500 text-sm">
          <p className="mb-1">Técnica Pomodoro: {getMinutes(DEFAULT_POMODORO_TIME)} minutos de foco</p>
          <p>Mantenha-se concentrado em uma única tarefa!</p>
        </div>
      </div>
    </div>
  );
}
