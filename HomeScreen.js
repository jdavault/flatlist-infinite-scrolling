import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Image, ActivityIndicator, Pressable } from 'react-native';
import axios from "axios"
import LoadMore from "./LoadMore"

export default function HomeScreen() {
  ``
  const [conversations, setConversations] = useState([])
  const [currPage, setCurrPage] = useState(0)
  const [hasMoreRecords, setHasMoreRecords] = useState(true)
  const [showIcon, setShowIcon] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [infiniteScroll, setInfiniteScroll] = useState(false)

  const [isLoading, setIsLoading] = useState(false);
  const PAGE_SIZE = 30

  const ItemSeparatorView = ({ item, index }) => {
    return (
      <View style={styles.separator} />
    )
  }

  // useEffect(() => {
  //   let subscribed = true

  //   if (subscribed) {
  //     setConversations([])
  //     setCurrPage(1)
  //   }
  //   return () => {
  //     subscribed = false
  //   }
  // }, [])

  const getConversations = async () => {
    setIsLoading(true)
    try {
      const endPoint = `http://localhost:4000/api/conversations?page=${currPage}&pagesize=${PAGE_SIZE}`
      const response = await axios.get(endPoint)
      if (response?.data && response.data.results) {
        console.log(`currPage: ${currPage}`)
        console.log(`conversations.length: ${conversations?.length}`)
        console.log(`response.data.results: ${response.data?.results?.length}`)
        setConversations([...conversations, ...response.data.results])
        setHasMoreRecords(response.data.info.hasMoreRecords)
      }
      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching user from NODE", err)
    }
  }

  const handleShowMore = () => {
    setCurrPage(1)
    setInfiniteScroll(false)
    setShowMore(true)
    console.log(`handleInfiniteScroll - currPage: ${currPage}`)

  }
  const handleInfiniteScroll = () => {
    setCurrPage(1)
    setShowMore(false)
    setInfiniteScroll(true)
    console.log(`handleInfiniteScroll - currPage: ${currPage}`)
  }

  useEffect(() => {
    console.log(`hasMoreRecords: ${hasMoreRecords}`)
    console.log(`currPage: ${currPage}`)
    currPage > 0 && hasMoreRecords && getConversations();
  }, [currPage])

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemWrapperStyle}>
        <View style={styles.contentWrapperStyle}>
          <Image style={styles.itemImageStyle} source={{ uri: item.picture.larage }} />
          <Text style={styles.txtNameStyle}>{`${item.name.title} ${item.name.first} ${item.name.last}`}</Text>
          <Text style={styles.txtEmailStyle}>{`${item.email}`}</Text>
        </View>
      </View>
    )
  }

  const renderIsLoadingSpinner = () => {
    return (
      isLoading && <View style={styles.loaderStyles}>
        <ActivityIndicator
          size="large"
          color="#aaa"
        />
      </View>
    )
  }

  const handleShowIcon = () => {
    setShowIcon(true)
    console.log("HandleShowIcon -- set to true")
  }

  const loadMoreItems = () => {
    if (hasMoreRecords && currPage > 0) {
      setCurrPage(prev => prev + 1)
    }
    setShowIcon(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row", paddingTop: 20, justifyContent: "space-around", alignItems: "center" }}>
        <Pressable onPress={handleShowMore} title="Show More"><Text>Show More</Text></Pressable>
        <Pressable onPress={handleInfiniteScroll} title="Infinite Scroll"><Text>Infinite Scroll</Text></Pressable>
      </View>
      {showMore ?
        <View>
          <View>
            {showIcon && <LoadMore label="Show Older Conversations" onLoadEarlier={loadMoreItems} isLoadingEarlier={isLoading} />}
          </View>
          <View>
            <FlatList
              keyExtractor={item => item.email}
              ItemSeparatorComponent={ItemSeparatorView}
              data={conversations}
              renderItem={renderItem}
              //ListFooterComponent={renderIsLoadingSpinner}
              onEndReached={handleShowIcon}
              onEndReachedThreshold={0.5}
            />
          </View>
        </View>
        :
        <FlatList
          keyExtractor={item => item.email}
          ItemSeparatorComponent={ItemSeparatorView}
          data={conversations}
          renderItem={renderItem}
          ListFooterComponent={renderIsLoadingSpinner}
          onEndReached={loadMoreItems}
          onEndReachedThreshold={0.5}
        />
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  itemWrapperStyle: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',

  },
  itemImageStyle: {
    width: 10,
    height: 50,
    marginRight: 16,
    fontSize: 24,
  }, contentWrapperStyle: {
    justifyContent: 'space-around'
  },
  txtNameStyle: {
    fontSize: 16
  },
  txtEmailStyle: {
    color: '#777'
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: "center"

  },
  separator: {
    height: 1
  }
});