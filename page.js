'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Stack, Typography, IconButton, Grid, Container, Paper, Card, CardContent, CardMedia, AppBar, Toolbar } from '@mui/material';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome! How can I help you today?',
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (isStreaming || !inputMessage.trim()) return;
    setIsStreaming(true);
    const userMessage = inputMessage;
    setInputMessage('');
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: userMessage }]);

    setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ role: 'user', content: userMessage }]),
      });

      const reader = response.body.getReader();
      let assistantMessageContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value, { stream: true });
        assistantMessageContent += chunk;

        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].content = assistantMessageContent;
          return newMessages;
        });
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(prev => !prev);
  };

  return (
    <>
      {/* Header and Navigation */}
      <AppBar position="static" sx={{ bgcolor: '#4169E1' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: '#f5f5f5', fontFamily: 'Lobster, cursive' }}>
            Travel Agency
          </Typography>
          <Button sx={{ color: '#f5f5f5' }}>Home</Button>
          <Button sx={{ color: '#f5f5f5' }}>Destinations</Button>
          <Button sx={{ color: '#f5f5f5' }}>Services</Button>
          <Button sx={{ color: '#f5f5f5' }}>Contact Us</Button>
        </Toolbar>
      </AppBar>

      {/* Main Content with Background Image */}
      <Box
        sx={{
          minHeight: '100vh', /* Ensure it covers the entire viewport height */
          backgroundImage: '/images/2.jpg', /* Path to your background image */
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: '#f5f5f5',
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            height: '50vh',
            backgroundImage: 'url(/images/travel-hero.jpg)', /* Hero image for the hero section */
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
          }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{ fontWeight: 'bold', fontFamily: 'Lobster, cursive' }}
          >
            Discover Your Next Adventure
          </Typography>
        </Box>

        {/* Popular Destinations Section */}
        <Container sx={{ py: 5 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#f5f5f5' }}>
            Popular Destinations
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: '#1e1e1e', color: '#f5f5f5' }}>
                <CardMedia
                  component="img"
                  alt="Paris"
                  height="200"
                  image="/images/2.jpg"
                  title="Paris"
                />
                <CardContent>
                  <Typography variant="h5">Paris, France</Typography>
                  <Typography variant="body2" color="white">
                    Experience the romance and elegance of Paris, from the Eiffel Tower to world-class museums.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: '#1e1e1e', color: '#f5f5f5' }}>
                <CardMedia
                  component="img"
                  alt="Bali"
                  height="200"
                  image="/images/3.jpg"
                  title="Bali"
                />
                <CardContent>
                  <Typography variant="h5">Bali, Indonesia</Typography>
                  <Typography variant="body2" color="white">
                    Unwind on pristine beaches, explore lush jungles, and dive into vibrant coral reefs.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: '#1e1e1e', color: '#f5f5f5' }}>
                <CardMedia
                  component="img"
                  alt="Swiss Alps"
                  height="200"
                  image="/images/4.jpg"
                  title="Swiss Alps"
                />
                <CardContent>
                  <Typography variant="h5">Swiss Alps, Switzerland</Typography>
                  <Typography variant="body2" color="white">
                    Adventure awaits in the Swiss Alps, with breathtaking hikes, skiing, and mountain villages.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Services Section */}
        <Box sx={{ py: 5, bgcolor: '#121212' }}>
          <Container>
            <Typography variant="h4" gutterBottom sx={{ color: '#f5f5f5' }}>
              Our Services
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: '#1e1e1e', color: '#f5f5f5' }}>
                  <Typography variant="h6">Hotels & Accommodations</Typography>
                  <Typography variant="body2" color="white">
                    Book the best hotels, resorts, and unique stays around the world.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: '#1e1e1e', color: '#f5f5f5' }}>
                  <Typography variant="h6">Travel Planning</Typography>
                  <Typography variant="body2" color="white">
                    Custom itineraries tailored to your preferences and budget.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: '#1e1e1e', color: '#f5f5f5' }}>
                  <Typography variant="h6">Visa Assistance</Typography>
                  <Typography variant="body2" color="white">
                    Simplified visa processing and documentation services.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: '#1e1e1e', color: '#f5f5f5' }}>
                  <Typography variant="h6">Transportation</Typography>
                  <Typography variant="body2" color="white">
                    Car rentals, airport transfers, and local transport solutions.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Chatbot Integration */}
        <Box
          position="fixed"
          bottom={16}
          right={16}
          width={isMinimized ? '60px' : '500px'}
          height={isMinimized ? '60px' : '550px'}
          borderRadius={2}
          boxShadow={3}
          overflow="hidden"
          bgcolor={isMinimized ? 'transparent' : '#121212'}
          color={isMinimized ? 'transparent' : '#f5f5f5'}
          transition="width 0.3s ease, height 0.3s ease"
          zIndex={1000}
        >
          {isMinimized ? (
            <IconButton onClick={toggleMinimize} sx={{ color: '#f5f5f5', bgcolor: '#4169E1', '&:hover': { bgcolor: '#424242' } }}>
              <ChatOutlinedIcon />
            </IconButton>
          ) : (
            <Stack height="100%" spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" p={2} sx={{ bgcolor: '#1e1e1e' }}>
                <Typography variant="h6" color="#f5f5f5">ExploreMore Assistant</Typography>
                <IconButton onClick={toggleMinimize} sx={{ color: '#f5f5f5' }}>
                  <CloseRoundedIcon />
                </IconButton>
              </Stack>
              <Box flexGrow={1} p={2} sx={{ overflowY: 'auto', bgcolor: '#121212', color: '#f5f5f5' }}>
                {messages.map((message, index) => (
                  <Box key={index} my={1} textAlign={message.role === 'user' ? 'right' : 'left'}>
                    <Typography
                      component="span"
                      px={2}
                      py={1}
                      borderRadius={2}
                      display="inline-block"
                      sx={{
                        bgcolor: message.role === 'user' ? '#1e88e5' : '#424242',
                        color: message.role === 'user' ? '#ffffff' : '#f5f5f5',
                      }}
                    >
                      {message.content}
                    </Typography>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>
              <Stack direction="row" alignItems="center" p={2} spacing={2} sx={{ bgcolor: '#1e1e1e' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  sx={{
                    input: {
                      bgcolor: '#121212',
                      color: '#f5f5f5',
                      borderRadius: 1,
                      '&::placeholder': { color: '#757575' },
                    },
                  }}
                  placeholder="Type your message..."
                />
                <Button onClick={handleSend} variant="contained" sx={{ bgcolor: '#1e88e5', '&:hover': { bgcolor: '#1565c0' } }}>
                  Send
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
}
