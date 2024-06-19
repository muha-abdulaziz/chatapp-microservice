workspace {

    model {
        user = person "User"
        softwareSystem = softwareSystem "Chat App" {
            emailSrv = container "Email Service"
            usersSrv = container "Users Service"
            chatSrv = container "Chat Service"
            cache = container "Cache (Redis)"{
                tags "cache"
            }
            db = container "db (Mongodb)" {
                tags "Database"
            }
        }

        user -> softwareSystem "Enters a chat room a an authinticated user"

        user -> usersSrv "A user authinticate."
        user -> chatSrv "A user connect to a chat room throw a websocket connection"

        usersSrv -> db "Save/Retrive user data"
        usersSrv -> emailSrv "Sends confirmation emails throw a messae queue"

        chatSrv -> usersSrv "Get created users and verify access tokens throw a message queue"
        chatSrv -> cache "Cache latest 10 messages and sync WS connection in case of replication."
    }

    views {
        systemContext softwareSystem "Diagram1" {
            include *
        }

        container softwareSystem "Diagram2" {
            include *
            autolayout lr
        }
        styles {
            element "Person" {
                shape person
            }

            element "Database" {
                shape cylinder
            }

            element "cache" {
                shape cylinder
            }
        }
    }

    # configuration {
    #     scope softwaresystem
    # }

}
