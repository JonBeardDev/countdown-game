const CORS_PROXY = process.env.REACT_APP_CORS_PROXY;

// Function to confirm if the word exists using GET /lookup
export const lookupWord = async (word) => {
  try {
    const response = await fetch(`${CORS_PROXY}lookup/${word}`, {
      mode: "cors",
    });
    const data = await response.json();
    return data.found;
  } catch (error) {
    console.error("Error occurred while looking up word:", error);
    return false; // Return false in case of an error
  }
};

// Function to get the best anagram using GET /best with the given letters
export const getBest = async (letters) => {
  try {
    const response = await fetch(`${CORS_PROXY}best/${letters.join("")}`, {
      mode: "cors",
    });
    const data = await response.json();
    return data.best;
  } catch (error) {
    console.error("Error occurred while getting best anagram:", error);
    return null; // Return null in case of an error
  }
};

export const getAll = async (letters) => {
  try {
    const response = await fetch(`${CORS_PROXY}all/${letters.join("")}`, {
      mode: "cors",
    });
    const data = await response.json();
    return data.all;
  } catch (error) {
    console.error("Error occurred while getting all anagrams:", error);
    return null;
  }
};
