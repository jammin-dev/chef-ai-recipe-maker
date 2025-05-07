import { useState, useEffect } from "react";

import { TypoH2 } from "@/components/ui/typography";

interface TypingEffectTitleProps {
	promptExamples: string[];
}

// Adjust these values to fine-tune the effect
const TYPING_SPEED_RANGE: [number, number] = [60, 120]; // random time per character (ms)
const DELETING_SPEED_RANGE: [number, number] = [20, 60]; // random time per character (ms)
const PAUSE_AFTER_TYPING = 1200; // time to wait after finishing a word (ms)

function getRandomSpeed(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function TypingEffectTitle({
	promptExamples,
}: TypingEffectTitleProps) {
	const [displayedText, setDisplayedText] = useState("");
	const [index, setIndex] = useState(0);
	const [charIndex, setCharIndex] = useState(0);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		setDisplayedText("");
		setIndex(0);
		setCharIndex(0);
		setIsDeleting(false);
	}, [JSON.stringify(promptExamples)]);

	useEffect(() => {
		const currentString = promptExamples[index];

		if (!isDeleting && charIndex < currentString.length) {
			// Typing forward
			const speed = getRandomSpeed(...TYPING_SPEED_RANGE);
			const timeout = setTimeout(() => {
				setDisplayedText((prev) => prev + currentString[charIndex]);
				setCharIndex((prev) => prev + 1);
			}, speed);

			return () => clearTimeout(timeout);
		}

		if (!isDeleting && charIndex === currentString.length) {
			// Pause a bit before starting to delete
			const timeout = setTimeout(() => {
				setIsDeleting(true);
			}, PAUSE_AFTER_TYPING);

			return () => clearTimeout(timeout);
		}

		if (isDeleting && charIndex > 0) {
			// Deleting backward
			const speed = getRandomSpeed(...DELETING_SPEED_RANGE);
			const timeout = setTimeout(() => {
				setDisplayedText((prev) => prev.slice(0, -1));
				setCharIndex((prev) => prev - 1);
			}, speed);

			return () => clearTimeout(timeout);
		}

		// Move to next index, reset for typing
		setIsDeleting(false);
		setIndex((prev) => (prev + 1) % promptExamples.length);
	}, [charIndex, isDeleting, index, promptExamples]);

	return (
		// <div className="h-16 w-4/5 md:w-3/4">
		<TypoH2>
			{displayedText}
			<span className="inline-block w-1.5 animate-blink">|</span>
		</TypoH2>
		// {/* </div> */}
	);
}
