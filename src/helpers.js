/**
 * Formats a phone number input into a standard (XXX) XXX-XXXX format.
 *
 * @param {string} value - The raw phone number input.
 * @returns {string} - The formatted phone number.
 */
const formatPhoneNumber = (value) => {
	// Remove all non-numeric characters from the input
	let formattedValue = value.replace(/[^\d]/g, "");

	// Apply formatting based on the length of the numeric string
	if (formattedValue.length <= 3) {
		// If only area code exists, wrap it in parentheses
		formattedValue = `(${formattedValue}`;
	} else if (formattedValue.length <= 6) {
		// If area code and prefix exist, format as (XXX) XXX
		formattedValue = `(${formattedValue.slice(0, 3)}) ${formattedValue.slice(3)}`;
	} else {
		// Format as (XXX) XXX-XXXX
		formattedValue = `(${formattedValue.slice(0, 3)}) ${formattedValue.slice(3, 6)}-${formattedValue.slice(6, 10)}`;
	}

	return formattedValue;
};

/**
 * Common units of measure (UOMs) used in inventory, pricing, or sales.
 */
const commonUOMs = ["unit", "each", "box", "pack", "case", "dozen", "pound", "kilogram", "liter", "gallon"];

/**
 * List of standard two-letter abbreviations for U.S. states.
 */
const usStateAbbreviations = [
	"AL",
	"AK",
	"AZ",
	"AR",
	"CA",
	"CO",
	"CT",
	"DE",
	"FL",
	"GA",
	"HI",
	"ID",
	"IL",
	"IN",
	"IA",
	"KS",
	"KY",
	"LA",
	"ME",
	"MD",
	"MA",
	"MI",
	"MN",
	"MS",
	"MO",
	"MT",
	"NE",
	"NV",
	"NH",
	"NJ",
	"NM",
	"NY",
	"NC",
	"ND",
	"OH",
	"OK",
	"OR",
	"PA",
	"RI",
	"SC",
	"SD",
	"TN",
	"TX",
	"UT",
	"VT",
	"VA",
	"WA",
	"WV",
	"WI",
	"WY",
];

export { formatPhoneNumber, commonUOMs, usStateAbbreviations };
