import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Papa from 'papaparse';
import { Card, Title, Paragraph, TextInput, Button } from 'react-native-paper';
import ExportDataButton from './ExportDataButton';

const BooksScreen = () => {
  const [booksData, setBooksData] = useState([]);
  const [magazineData, setMagazineData] = useState([]);
  const [searchISBN, setSearchISBN] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [data, setData] = useState([]);
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    fetchBooksData();
    fetchMagazineData();
  
  }, []);


  const fetchBooksData = async () => {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/books.csv'
      );
      const csvData = await response.text();
      const books = parseCsvData(csvData);
      setBooksData(books);
    } catch (error) {
      console.error('Error fetching books data:', error);
    }
  };

  const fetchMagazineData = async () => {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/magazines.csv'
      );
      const csvData = await response.text();
      const books = parseCsvData(csvData);
      setMagazineData(books);
    } catch (error) {
      console.error('Error fetching magazine data:', error);
    }
  };


  const parseCsvData = (csvData) => {
    const results = Papa.parse(csvData, { header: true });
    const jsonData = results.data;
    return jsonData;
  };

  const handleSearch = () => {
    const book = booksData.find((book) => book.isbn === searchISBN);
    const magazine = magazineData.find((magazine) => magazine.isbn === searchISBN);
    if (book) {
      setSearchResult(book);
    } else if (magazine) {
      setSearchResult(magazine);
    } else {
      setSearchResult(null);
    }
  };

  const handleClear = () => {
    setSearchISBN('');
    setSearchResult(null);
  };

  
  const handleSearchEmail = () => {
    setSorted(true);

    const bookResults = booksData.filter((book) => book.authors && book.authors.toLowerCase().includes(searchEmail.toLowerCase()));
    const magazineResults = magazineData.filter((magazine) => magazine.authors && magazine.authors.toLowerCase().includes(searchEmail.toLowerCase()));
    setSearchResults([...bookResults, ...magazineResults]);
  };

  const handleClearEmail = () => {
    setSorted(false);
    setSearchEmail('');
    setSearchResults([]);
  };


  const handleSort = (data) => {
    const sortedResults = [...data].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    if(data == searchResults){
        setSearchResults(sortedResults);
    }
    else if(data == booksData){
        setBooksData(sortedResults);
    }
    else if(data == magazineData){
        setMagazineData(sortedResults);
    }else{
        null;
    }
    
  };

  setTimeout(() => {
    const combinedData = [...booksData, ...magazineData];
    setData(combinedData);
  }, 3000);

  

  return (
    <ScrollView>

    <Title style={{textAlign:'center'}}>Search Books and Magazines :</Title>

    <View style={{alignItems:'center', textAlign:'center', justifyContent:'center'}}>
        <TextInput
            label="Enter ISBN"
            value={searchISBN}
            onChangeText={setSearchISBN}
            style={{ marginBottom: 16, width:'80%' }}
        />

        <View style={{display:'flex', flexDirection:'row'}}>
            <Button mode="contained" onPress={handleSearch} style={{ marginBottom: 16, width:'40%', marginRight:'3%' }}>
                Search
            </Button>
            <Button mode="outlined" onPress={handleClear} style={{ marginBottom: 16, width:'40%' }}>
                Clear
            </Button>
        </View>
    </View>

    {searchResult && (
    <Card style={{margin:'5%'}} key={searchResult.isbn}>
        <Card.Content>
            <Title>{searchResult.title}</Title>
            <Text>ISBN: {searchResult.isbn}</Text>
            <Text style={{ fontWeight: 'bold' }}>Authors: {searchResult.authors}</Text>
            {searchResult.publishedAt ? <Text >Published at: {searchResult.publishedAt}</Text> : null}
            {searchResult.description ? <Text >Description : {searchResult.description}</Text> : null}
        </Card.Content>
    </Card>
    )}


    <View style={{alignItems:'center', textAlign:'center', justifyContent:'center'}}>
      <TextInput
        label="Enter Author's Email"
        value={searchEmail}
        onChangeText={setSearchEmail}
        style={{ marginBottom: 16, width:'80%' }}
      />

      <View style={{display:'flex', flexDirection:'row'}}>
        <Button mode="contained" onPress={handleSearchEmail} style={{ marginBottom: 16, width:'40%', marginRight:'3%' }}>
            Search
        </Button>
        <Button mode="outlined" onPress={handleClearEmail} style={{ marginBottom: 16, width:'40%' }}>
                Clear
        </Button>
      </View>
    </View>

    <View style={{textAlign:'center', alignItems:'center'}}>
        {sorted ? <Button mode="contained-tonal" onPress={() => handleSort(searchResults)} style={{ marginBottom: 16, width:'70%' }}>
            Sort by Title
        </Button> : null}
    </View>

      {searchResults.map((item) => (
        <Card key={item.isbn} style={{margin:'5%'}}>
          <Card.Content>
            <Title>{item.title}</Title>
            <Text>ISBN: {item.isbn}</Text>
            <Text style={{ fontWeight: 'bold' }}>Authors: {item.authors}</Text>
            {item.publishedAt ? <Text >Published at : {item.publishedAt}</Text> : null}
            {item.description ? <Text >Description : {item.description}</Text> : null}
          </Card.Content>
        </Card>
      ))}

    

    <Text style={{fontWeight: 'bold', fontSize: 30, margin:'5%'}}>
            All Books :
    </Text>

    <View style={{alignItems:'center'}}>
        <Button mode="contained-tonal" onPress={() => handleSort(booksData)} style={{ marginBottom: 16, width:'70%' }}>
                Sort by Title
        </Button>
    </View>

    {booksData.map((book) => (
      <Card key={book.isbn} style={{margin:'2%'}}>
        

        <Card.Content>
          <Title>{book.title}</Title>
          <Paragraph style={{ fontWeight: 'bold' }}>Author: {book.authors}</Paragraph>
          <Text variant="bodyMedium"><Paragraph>Short description : </Paragraph> {'\n'}{book.description}</Text>
        </Card.Content>
      </Card>
    ))}


    <Text style={{fontWeight: 'bold', fontSize: 30, margin:'5%'}}>
            All Magazines :
    </Text>
    <View style={{alignItems:'center'}}>
        <Button mode="contained-tonal" onPress={() => handleSort(magazineData)} style={{ marginBottom: 16, width:'70%' }}>
                Sort by Title
        </Button>
    </View>
    {magazineData.map((magazine) => (
      <Card key={magazine.isbn} style={{margin:'2%'}}>
        

        <Card.Content>
          <Title>{magazine.title}</Title>
          <Paragraph>Author: {magazine.authors}</Paragraph>
          <Text style={{ fontWeight: 'bold' }}>
              Published at: {magazine.publishedAt}
            </Text>
        </Card.Content>
      </Card>
    ))}

    <ExportDataButton data={data}/>

  </ScrollView>
  );
};

export default BooksScreen;
