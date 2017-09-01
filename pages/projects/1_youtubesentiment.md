---
title: Youtube Sentiment Analysis
tagline: Real Time - YouTube Video Sentiment Analysis
type: Everything
platform: Web
status: released
technologies:
  - Apache Kafka
  - Spark Streaming
  - Stanford Corenlp (Library)
  - Redis PubSub
  - Scala
  - Python
  - D3.js (Library)
roles: Developer, UI Designer

header_image_small: url(./assets/projects/BigData_Frontend.png)
header_image_big: url(./assets/projects/BigData_Frontend.png)
header_background_color: '#000300'
header_background_size: '100% 100%'
---

-------

## Description and Working
Youtube Sentiment Analysis is a real time web platform, which shows a sentiment analysis of video's comments that you get from the standard youtube APIs.  When given a keyword, I fetch comments of top videos using __YouTube’s__ ‘Search’ and ‘Comment’ APIs and organize this data in a desired format. Now, in order to make a data pipeline for streaming data, I send this data to an __Apache Kafka producer__, written in __Java__. Using __Spark Streaming__ in __Scala__, I process this streaming data in small batches i.e. take the sentiment score of all the comments using the __Stanford Corenlp library__ and group them based on each video. This resultant data is then stored on a local __Redis Server__ in order to be picked up by the event stream created in __Python (Flask)__. Finally, we visualize this data using __JavaScript’s D3.js library__.

Here is the architecture of this project:
<img src='assets/projects/architecture.png' class='media-element center' style='padding-left:20px; padding-right:20px' />

##Let’s discuss the use of every technology used in this project: 
__YouTube Data API’s:__ 
We are using two of the YouTube data API’s. One is for Search and second is for Comments. The Search API takes a keyword as parameter and give video’s as results. The Comment API, takes video id’s and gives list of comments as response. Below are the urls of YouTube data APIs used in the project. 
<a src = "https://www.googleapis.com/youtube/v3/search" >Search API
<a src = "https://www.googleapis.com/youtube/v3/commentThreads" >Comments API

We have used Java to fetch data continuously, this java app starts and asks for a keyword. This keyword is given to the search API and which starts pulling all videos. Given the list of videos then it calls the comments API for fetching recent comments. Once comments data is available the app starts publishing the data to __Kafka__ topic “YouTube”. The app runs till it retrieves all the data for the searched videos.

__APACHE KAFKA:__
Kafka, in this application, act as data pipeline which provides streaming data. Kafka producer is written in java which hits the YouTube Data API and starts publishing data in its producer as text messages delimited by “|”. This text message consists of video id, video title, video description and comment text. 
In our application we are using Kafka as standalone mode which can be scaled to clusters when required, the main reason to use Kafka is because it is distributed system so scaling of application can be done easily and it has very high throughput and also keeps messages in buffer so no streaming data is lost.

__SPARK STREAMING:__ 
In this application, Spark Streaming is used to consume stream’s from Kafka. Code is written in Scala. Firstly, I am consuming the stream from Kafka and creates a direct stream using Spark Streaming, as I discussed earlier about the format of our messages coming from Kafka, here I split the messages and convert that it into data frames. I am using Stanford Corenlp library to analyze the sentiments of comment text from the messages received from the stream. I query this Data-Frame using Spark SQL. Comment column of each Data-Frame row is passed to the sentiment function which returns a score. Sentiment score is averaged out over all comments of a particular batch by their video id’s and publish it on redis server. 

__REDIS SERVER:__  
Redis Pub-Sub feature is used as a message broker which can be used to create event streams for our web server, so our web server can push data to clients without client’s request. The use of this is to create a real-time visualization. Here I have created a channel named “YouTube” where analyzed data from Spark Streaming is published to this channel which will be consumed by the web server and further pushed to the client application. One of the most important reason of choosing Redis is that it can be used as a distributed system, where we can create cluster (multiple instance) which is highly scalable and fast because of in-memory database.

__PYTHON as WEB SERVER SIDE APP(FLASK):__ 
The reason behind using python flask is because the development is very rapid and it is highly scalable. I have used Flask for its simplicity and its features. Requirements here, are limited to a small web server which can consume the messages from redis channel and push the data to client as soon as it consumes the data from Redis channel. In this application I have created a web server and an endpoint url for “text/event-stream”.  I have created “/stream” endpoint where our python server keeps pushing data as soon as it consumes from Redis server. The format of messages pushed to client is Video Id, Video Title, Video description, Average Sentiment Score for Comments separated by a delimiter “,”.

__CLIENT APPLICATION (DASHBOARD):__ 
I am using JavaScript, JQuery and D3.js for our dashboard. D3.js is an amazing visualization JavaScript library. It's use, here, is to create bar charts for all the videos which we are analyzing. You can notice the changes here in real-time, i.e. as soon as the stream keeps coming and analyzed and sent to redis our visualization keeps updating automatically. The performance was quite good and we noticed changes in visualization in every 1-2 seconds. Along with the bar chart we are also updating our UI as soon as a chunk of data comes in a table which displays the Video Id, Video Title, Video description and batch average comment sentiment score. This batch is a streaming batch i.e. all the data analyzed in one batch of streaming(as we know spark streaming is processed in micro-batches).

Each bar is color coded based on the total average sentiment score of each video. (__Red : Negative, Yellow : Neutral, Green : Positive__)
