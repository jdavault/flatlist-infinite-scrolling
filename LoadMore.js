/** @format */
import React, { useState } from "react"
import { ActivityIndicator, StyleSheet, Text, View, Platform, TouchableOpacity } from "react-native"

const LoadMore = (props) => {

  console.log("=========================================props.isLoadingEarlier: ", props.isLoadingEarlier)

  const renderLoading = () => {
    if (props.isLoadingEarlier === false) {
      return (<Text style={styles.text}>
        {props.label}
      </Text>);
    }
    return (<View>
      <Text style={[styles.text, { opacity: 0 }]}>
        {props.label}
      </Text>
      <ActivityIndicator color="white" size="small" style={styles.activityIndicator} />
    </View>);
  }

  return (
    <TouchableOpacity style={styles.container}
      onPress={() => {
        props.onLoadEarlier();
      }}>
      <View style={styles.wrapper}>
        {renderLoading()}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#b2b2b2',
    borderRadius: 15,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  text: {
    backgroundColor: 'transparent',
    color: "white",
    fontSize: 12,
  },
  activityIndicator: {
    marginTop: Platform.select({
      ios: -14,
      android: -16,
      default: -15,
    }),
  },
});

export default LoadMore
