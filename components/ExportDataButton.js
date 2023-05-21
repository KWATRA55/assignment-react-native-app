import React from 'react';
import { Button } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';   

const ExportDataButton = ({ data }) => {
    const handleExport = async () => {
        try {
          const csvData = convertToCsv(data);
          const fileUri = FileSystem.documentDirectory + 'exported_data.csv';
          await FileSystem.writeAsStringAsync(fileUri, csvData, { encoding: FileSystem.EncodingType.UTF8 });
      
          await Sharing.shareAsync(fileUri); // Use Expo Sharing API to share the file
      
        } catch (error) {
          console.error('Error exporting data:', error);
        }
      };
  const convertToCsv = (data) => {
    // Convert data array to CSV format
    let csv = '';
    const headerRow = Object.keys(data[0]).join(',') + '\n';
    csv += headerRow;

    data.forEach((item) => {
      const row = Object.values(item).join(',') + '\n';
      csv += row;
    });

    return csv;
  };

  return (
    <Button mode="contained" onPress={handleExport} style={{ marginBottom: 16 }}>
      Export Data as csv
    </Button>
  );
};

export default ExportDataButton;
