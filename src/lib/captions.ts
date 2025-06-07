import _captions from './captions.json' with { type: 'json' };

export type Captions = {
	[year in string]:
		| {
				[month in string]:
					| {
							[date in string]: string | undefined;
					  }
					| undefined;
		  }
		| undefined;
};

export const captions: Captions = _captions;
