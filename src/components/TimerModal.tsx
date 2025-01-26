import React, { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import { useTimerStore } from "../store/useTimerStore";
import { validateTimerForm } from "../utils/validation";
import { Timer } from "../types/timer";
import { SecondaryButton } from "./SecondaryButton";
import { PrimaryButton } from "./PrimaryButton";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timer?: Timer;
}

export const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  onClose,
  timer,
}) => {
  const [title, setTitle] = useState(timer?.title ?? "");
  const [description, setDescription] = useState(timer?.description ?? "");
  const [hours, setHours] = useState(
    timer ? Math.floor(timer.duration / 3600) : 0
  );
  const [minutes, setMinutes] = useState(
    timer ? Math.floor((timer.duration % 3600) / 60) : 0
  );
  const [seconds, setSeconds] = useState(timer ? timer.duration % 60 : 0);
  const [touched, setTouched] = useState({
    title: false,
    hours: false,
    minutes: false,
    seconds: false,
  });

  const { addTimer, editTimer } = useTimerStore();

  useEffect(() => {
    if (isOpen && timer) {
      setTitle(timer.title);
      setDescription(timer.description);
      setHours(Math.floor(timer.duration / 3600));
      setMinutes(Math.floor((timer.duration % 3600) / 60));
      setSeconds(timer.duration % 60);
      setTouched({
        title: false,
        hours: false,
        minutes: false,
        seconds: false,
      });
    }
  }, [isOpen, timer]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateTimerForm({ title, description, hours, minutes, seconds }))
      return;

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (timer) {
      editTimer(timer.id, {
        title: title.trim(),
        description: description.trim(),
        duration: totalSeconds,
      });
    } else {
      addTimer({
        title: title.trim(),
        description: description.trim(),
        duration: totalSeconds,
        remainingTime: totalSeconds,
        isRunning: false,
      });
    }

    onClose();
  };

  const resetForm = () => {
    if (!timer) {
      setTitle("");
      setDescription("");
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
    setTouched({ title: false, hours: false, minutes: false, seconds: false });
    onClose();
  };

  const isTimeValid = hours > 0 || minutes > 0 || seconds > 0;
  const isTitleValid = title.trim().length > 0 && title.length <= 50;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">
              {timer ? "Edit Timer" : "Add New Timer"}
            </h2>
          </div>
          <button
            onClick={resetForm}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched({ ...touched, title: true })}
              maxLength={50}
              className={`
                border bg-transparent px-3 py-2 w-full rounded-md shadow-sm focus:shadow-md focus:ring-0 focus:outline-0
                ${
                  touched.title && !isTitleValid
                    ? "border-red-500 focus:shadow-red-500/20"
                    : "border-gray-300 focus:shadow-blue-500/20 focus:border-blue-500"
                }`}
              placeholder="Enter timer title"
            />
            {touched.title && !isTitleValid && (
              <p className="mt-1 text-sm text-red-500">
                Title is required and must be less than 50 characters
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {title.length}/50 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="border bg-transparent px-3 py-2 w-full rounded-md shadow-sm focus:shadow-md focus:ring-0 focus:outline-0 border-gray-300 focus:shadow-blue-500/20 focus:border-blue-500"
              placeholder="Enter timer description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Duration <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {["Hours", "Minutes", "Seconds"].map((label, index) => (
                <div key={label}>
                  <label className="block text-sm text-gray-600 mb-1">
                    {label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={index === 0 ? "23" : "59"}
                    value={[hours, minutes, seconds][index]}
                    onChange={(e) => {
                      const value = Math.min(
                        index === 0 ? 23 : 59,
                        parseInt(e.target.value) || 0
                      );
                      [setHours, setMinutes, setSeconds][index](value);
                    }}
                    onBlur={() =>
                      setTouched({ ...touched, [label.toLowerCase()]: true })
                    }
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:shadow-md focus:shadow-blue-500/20 focus:ring-0 focus:outline-0"
                  />
                </div>
              ))}
            </div>
            {touched.hours &&
              touched.minutes &&
              touched.seconds &&
              !isTimeValid && (
                <p className="mt-2 text-sm text-red-500">
                  Please set a duration greater than 0
                </p>
              )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <SecondaryButton type="button" onClick={resetForm}>
              Cancel
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              disabled={!isTitleValid || !isTimeValid}
            >
              {timer ? "Save Changes" : "Add Timer"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};
