export interface JQueryWithValidator extends JQueryStatic {
    validator: {
        messages: string,
        format: (str: string) => string
    }
}