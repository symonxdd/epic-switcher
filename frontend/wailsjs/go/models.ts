export namespace models {
	
	export class LoginSession {
	    username: string;
	    userId: string;
	    alias: string;
	    loginToken: string;
	    created_at: string;
	    updated_at: string;
	
	    static createFrom(source: any = {}) {
	        return new LoginSession(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.username = source["username"];
	        this.userId = source["userId"];
	        this.alias = source["alias"];
	        this.loginToken = source["loginToken"];
	        this.created_at = source["created_at"];
	        this.updated_at = source["updated_at"];
	    }
	}

}

