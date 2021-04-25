import { getOutput, Language, Output } from ".";

// TODO: Rewrite tests using Mock
describe("Language", () => {
    test("should parse simple output", () => {
        const output = getOutput(Output.VoteSuccess, Language.PortugueseBrazil);
        expect(output).toBe("voto computado com sucesso!");
    });

    test("should parse output with argument", () => {
        const output = getOutput(
            Output.AnimeFetchFailed,
            Language.PortugueseBrazil,
            ["animeError"]
        );
        expect(output).toBe(
            "ocorreu algum problema enquanto procurava seu anime. Tente mais tarde! Erro: animeError"
        );
    });
});
