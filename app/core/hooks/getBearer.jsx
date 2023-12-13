import axios from "axios";

export const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://sheets.googleapis.com/v4/spreadsheets/1ID0t2lE0pcFe93PBpuGCsYiETY06Pr1qKTnB1OziLfI/values/Auth!A2?key=AIzaSyD_g1OLO_NvhbuqLORWHC9YQYFqSpudS6A',
        // Replace YOUR_SPREADSHEET_ID, YOUR_RANGE, and YOUR_API_KEY with actual values
      );
      console.log("data", response.data.values)
      return response.data.values
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
    }
  };

