export interface OutputStr {
    PT: string;
    EN: string;
}

export const Output = {
    Vote: {
        InvalidArgs: {
            PT: "parâmetros inválidos!",
            EN: "invalid params!",
        },
        NoActivePolls: {
            PT: "nenhuma enquete está ativa no momento.",
            EN: "there are no active polls right now.",
        },
        Success: {
            PT: "voto computado com sucesso!",
            EN: "vote computed with success!",
        },
    },
    Poll: {
        InvalidArgs: {
            PT: "parâmetros inválidos!",
            EN: "invalid params!",
        },
        NoPermission: {
            PT: "você não tem permissão para executar essa ação.",
            EN: "insufficient permissions.",
        },
        Success: {
            PT:
                "A enquete foi criada e deve encerrar em %args0 minutos! %args1 %args2",
            EN:
                "The poll was created and will close in %args0 minutes! %args1 %args2",
        },
    },
    Anime: {
        NoArguments: {
            PT: "preciso do nome do anime!",
            EN: "I need an anime name!",
        },
        FetchFailed: {
            PT:
                "ocorreu algum problema enquanto procurava seu anime. Tente mais tarde! Erro: %args0",
            EN: "something went wrong. Try it later. Error: %args0",
        },
        SuccessDiscord: {
            PT:
                "\n%args0 (%args1)\n**Gênero**: %args2\n**Episódios**: %args3\n%args4\n**Nota**: %args5\n%args6",
            EN:
                "\n%args0 (%args1)\n**Genres**: %args2\n**Episodes**: %args3\n%args4\n**Score**: %args5\n%args6",
        },
        SuccessTwitch: {
            PT:
                "%args0 (%args1) - Gêneros: %args2 - Episódios: %args3 - Nota: %args4",
            EN:
                "%args0 (%args1) - Genres: %args2 - Episodes: %args3 - Note: %args4",
        },
    },
    PollStatus: {
        NoRecentPolls: {
            PT: "nenhuma enquete terminou recentemente",
            EN: "no poll results are available",
        },
        SuccessDiscord: {
            PT: "**Resultado para %args0:**\n%args1",
            EN: "**Results for %args0:**\n%args1",
        },
        SuccessDiscordOption: {
            PT: "**%args0** - %args1 votos",
            EN: "**%args0** - %args1 votes",
        },
    },
    Settings: {
        NoArguments: {
            PT: "settings <set/get> <language> <?selectedLanguage>",
            EN: "settings <set/get> <language> <?selectedLanguage>",
        },
        GetLanguage: {
            PT: "linguagem = %args0.",
            EN: "language = %args0.",
        },
        InvalidLanguage: {
            PT: "Linguagem não suportada. Atualmente são suportadas: %args0",
            EN: "Language not supported. Currently supported languages: %args0",
        },
        SetLanguageSuccess: {
            PT: "Linguagem PT foi selecionada.",
            EN: "EN Language was selected.",
        },
    },
};
