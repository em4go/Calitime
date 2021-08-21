export type Exercise = {
	_id: string;
	name: string;
	isRest: boolean;
	repsMode: boolean;
	time: number;
	color: number;
	reps: number;
	sortId: number;
	order?: number;
	_rev?: string;
};
export type ExerciseForm = {
	name: string;
	color: number;
	repsMode: boolean;
	reps: number;
	isRest: boolean;
	time: number;
};

export type Workout = {
	id?: string;
	name: string;
	laps: number;
	totalTime: number;
	exercises: Exercise[];
};
