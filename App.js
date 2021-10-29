import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import  AppLoading from 'expo-app-loading';
import { AntDesign } from '@expo/vector-icons';
import { useFonts, Allura_400Regular } from '@expo-google-fonts/allura';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, TouchableHighlight, AsyncStorage,Modal, ScrollView, TextInput } from 'react-native';

export default function App() {

  const image = require('./resources/bg.jpg');

  const [tarefas, setTarefas] = useState([]);

    const [modal, setModal] = useState(false);
    
    const [tarefaAtual, setTarefaAtual] = useState('');

    

  let[fontsLoaded] = useFonts({
    Allura_400Regular,
  });

 

  useEffect(() => {
    //alert ('app carregado...');

    (async () => {
      try{
          let tarefasAtual = await AsyncStorage.getItem('tarefas');
          if (tarefasAtual == null)   
          setTarefas([]);
          else 
          setTarefas(JSON.parse(tarefasAtual));
      }catch(error){
              //Error saving data
      }
     })();
  },[])

  if (!fontsLoaded){
    return <AppLoading />;
  }

 
  
  function deletarTarefa(id){
      alert('Tarefa com id' +id+ 'foi deletada com sucesso!');
      //Todo: Deletar do array/stado a tarefa com id especificado!
      let newArray = tarefas.filter(function(val){
              return val.id != id;
      });

      setTarefas(newArray);

     (async () => {
        try{
          await AsyncStorage.setItem('tarefas', JSON.stringify(newArray));
            //console.log('chamado');
        }catch(error){
            //Error saving data
        }
        
      })();
    
  }

  function addTarefa(){

    setModal(!modal);
    
    let id = 0;
    if(tarefas.length > 0){
        id = tarefas[tarefas.length-1].id +1 ;
     
    }
    let tarefa = {id:id,tarefa:tarefaAtual};

    setTarefas([...tarefas,tarefa]);

    (async () => {
      try{
        await AsyncStorage.setItem('tarefas', JSON.stringify([...tarefas,tarefa]));
      }catch(error){

      }
    })();
      
    
  }


  return (
    <ScrollView style={{flex:1}}>
      <StatusBar hidden />
            <Modal
            animationType='slide'
            transparent={true}
            visible={modal}
            onRequestClose={() => {
              Alert.alert("Modal has been closed");
            }}
            
            >
              
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TextInput onChangeText={text => setTarefaAtual(text)} autoFocus={true}></TextInput>

                      <TouchableHighlight
                        style={{...styles.openButton, backgroundColor:"#2196F3"}}
                          onPress={() => {addTarefa()}}
                          >
                        <Text style={styles.textStyle}>Adicionar Tarefa</Text>
                      </TouchableHighlight>
                    </View>
               </View>
          </Modal>
          
              <ImageBackground source={image} style={styles.image}>
                  <View style={styles.coverView}>
                    <Text style={styles.textHeader}>Agenda de Tarefas</Text>
                  </View>
              </ImageBackground>
            
                {
                  tarefas.map(function(val){
                    return (<View style={styles.tarefaSingle}>
                        <View style={{flex:1, width:'100%', padding:10}}>
                          <Text>{val.tarefa}</Text>
                            </View>
                            <View style={{alignItems:'flex-end',flex:1,padding:10}}>
                                <TouchableOpacity onPress={() => deletarTarefa(val.id)}>
                                  <AntDesign name='minuscircleo' size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>);
                        
                   })

                }
                  <View onPress={()=> salvarTarefa()} style={styles.adicionar}> 
                        <TouchableOpacity onPress={()=> setModal(true)}>
                            {<AntDesign name="pluscircleo" size={24} color="black" />}
                        </TouchableOpacity>
                  </View>      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    image:{
      width: '100%',
      height:80,
      resizeMode: "cover"
      
    },
    coverView:{
      width: '100%',
      height: 80,
      backgroundColor:'rgba(0, 0, 0, 0.5)'
    },

    textHeader:{
      fontSize:50,
      textAlign:'center',
      marginTop:20,
      color:'white',
      opacity:0.5,
      fontFamily: 'Allura_400Regular'

    },

    tarefaSingle:{
      marginTop:30,
      width:'100%',
      borderBottomWidth:1,
      borderBottomColor:'black',
      flexDirection:'row',
      paddingBottom:10
    },
   
    //Estilos da modal!
    centeredView:{
      flex:1,
      justifyContent:"center",
      alignItems:"center",
      backgroundColor: 'rgba(0, 0, 0,0.5)'
    },
    modalView:{
      margin:20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems:"center",
      shadowColor:"#000",
      shadowOffset:{
        width:0,
        height:2
      },
      shadowOpacity:0.25,
      shadowRadius:3.84,
      elevation:5,
      zIndex:5
    },
    openButton:{
      backgroundColor:"#F194FF",
      borderRadius:20,
      padding:10,
      elevation:5
    },
    textStyle:{
      color:"white",
      fontWeight:"bold",
      textAlign:"center"
    },
    modalText:{
      marginBottom:15,
     textAlign: "center"
    },

    //Adicionar Tarefas da TouchAbleOpacity
    adicionar:{
      alignItems:'flex-end',
      flex:1,
      padding:10

    }


});
