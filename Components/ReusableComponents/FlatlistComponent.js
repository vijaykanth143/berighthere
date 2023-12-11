import React, {Component} from 'react';
import { FlatList, SafeAreaView } from 'react-native';

export default class FlatListComponent extends Component{
    render(){
        return(
            <SafeAreaView>
                <FlatList 
                keyboardShouldPersistTaps='always'
                    data = {this.props.data}
                    renderItem={this.props.renderItem}
                    horizontal = {this.props.horizontal}
                    showsHorizontalScrollIndicator={false}
                    numColumns = {this.props.numColumns}
                    columnWrapperStyle={this.props.columnWrapperStyle}
                    ListFooterComponent = {this.props.ListFooterComponent}
                    ListFooterComponentStyle={this.props.ListFooterComponentStyle}
                    extraData = {this.props.extraData}
                    //onEndReachedThreshold={0.7}
                    ListHeaderComponent = {this.props.ListHeaderComponent}
                    refreshControl = {this.props.refreshControl}
                    refreshing = {this.props.refreshing}
                    onEndReached = {this.props.onEndReached}
                    
                />
            </SafeAreaView>
        );
    }
}