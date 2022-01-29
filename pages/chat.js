import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import Fundo from "../img/Fundo.png"
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js'
import {ButtonSendSticker} from '../src/components/ButtonSendSticker'


const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMzMDg0NiwiZXhwIjoxOTU4OTA2ODQ2fQ.1QTO5pDPgrcfDcL_l_f7sgVZ_cIVTIlst9NK3Joz7yc'
const SUPABASE_URL = 'https://vmdamhclnjqbcdawumua.supabase.co';
const supabaseClient = createClient(SUPABASE_URL,SUPABASE_ANON_KEY);


function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive) => {
            adicionaMensagem(respostaLive.new);
        })
        .subscribe();
}



export default function ChatPage() {
   
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    // console.log('roteamento.query',roteamento.query);
    // console.log('usuarioLogado', usuarioLogado);
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

    ///

    
    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id',{ascending: false})
            .then(({data}) => {
                console.log("Dados da consulta", data);
                setListaDeMensagens(data);
            });
           
        const subscription = escutaMensagensEmTempoReal((novaMensagem) =>{
            console.log('Nova mensagem:', novaMensagem);
            console.log('listaDeMensagens:', listaDeMensagens);

            setListaDeMensagens ((valorAtualDaLista) => {
                console.log('valorAtuaDaLista', valorAtualDaLista);
                return [
                    novaMensagem,
                    ...valorAtualDaLista,
                ]
            });
        });

        
    }, []);

    
    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            //id: listaDeMensagens.length + 1,
            de: usuarioLogado,
            texto: novaMensagem.trim(),
        };

        supabaseClient
            .from('mensagens')
            .insert ([
                mensagem
            ])
            .then(({data})=> {
                console.log('Criando mensagem: ', data);
                
            });

        setMensagem('');
    }


    function handleDeletaMensagem(event) {
        const mensagemId = Number(event.target.dataset.id);
        console.log('idmensagemapagada', mensagemId);

        supabaseClient
            .from('mensagens')
            .delete()
            .match({id: mensagemId})
            .then(({data}) => {
                const mensagemFiltradaDaLista = listaDeMensagens.filter((mensagemFiltrada) => {
                    return mensagemFiltrada.id != data[0].id
                })
                setListaDeMensagens(mensagemFiltradaDaLista)
            })
    }



    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(${Fundo.src})`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',                    
                    border: "4px solid",
                    borderColor: appConfig.theme.colors.primary[999],
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        border: "4px solid",
                        borderColor: appConfig.theme.colors.primary[999],
                        padding: '16px',
                    }}
                >
                    <MessageList 
                        mensagens={listaDeMensagens}
                        handleDeletaMensagem={handleDeletaMensagem}
                        
                    />
                         
                    
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'start',
                            justifyContent: "center"
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[900],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                                
                            }}                            
                        />

                        {/* CallBack */}

                        <ButtonSendSticker
                            onStickerClick = {(sticker) => {
                                handleNovaMensagem (':sticker:' + sticker);
                            }}
                            

                        />                       
                        
                        
                        <Button
                            type="submit"
                            label="Enviar"
                            onClick={() => handleNovaMensagem(mensagem)}
                            styleSheet={{
                                minHeight: "34px",
                                padding: "12px 12px",
                            }}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[800],
                                mainColorLight: appConfig.theme.colors.primary[900],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                        />

                    </Box>
                </Box>
            </Box>
        </Box>
    )
}



function Header() {
    return (
        <>
            <Box styleSheet={{ 
                    width: '100%',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }} >
                <Text variant='heading3'>
                    Chat
                </Text>
                <Button
                    //variant='tertiary'
                    buttonColors={{
                        contrastColor: appConfig.theme.colors.neutrals["000"],
                        mainColor: appConfig.theme.colors.primary[999],
                        mainColorLight: appConfig.theme.colors.primary[400],
                        mainColorStrong: appConfig.theme.colors.primary[800],
                    }}
                    //colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}


function MessageList(props) {
    console.log(props);
    const handleDeletaMensagem = props.handleDeletaMensagem;
    
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            border:'2px solid',
                            borderColor: appConfig.theme.colors.primary[999], 
                            borderRadius: '10px',
                            padding: '6px',
                            marginBottom: '12px',
                            backgroundColor: appConfig.theme.colors.neutrals[800],
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',                                
                            }}
                        >
                            
                            <Image
                                styleSheet={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'inline-block',
                                marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '12px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleTimeString())} 
                                {" - "}
                                {(new Date().toLocaleDateString())}
                            </Text>
                            <Text
                                onClick={handleDeletaMensagem}
                                styleSheet ={{
                                    fontSize: '13px',
                                    fontWeght: 'bold',
                                    marginLeft: 'auto',
                                    color: appConfig.theme.colors.neutrals[100],
                                    backgroundColor: appConfig.theme.colors.primary[999],
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '10%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                                tag="span"
                                data-id = {mensagem.id}                            
                            >
                                X
                            </Text>
                        </Box>

                        {mensagem.texto.startsWith(':sticker:')
                            ? (
                                <Image src={mensagem.texto.replace(':sticker:', '')} />
                            )
                            : (
                                mensagem.texto
                            )}
                    </Text>
                );
            })}
        </Box>
    )
} 