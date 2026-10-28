export namespace models {
	
	export class NewLauncherLogin {
	    credential: string;
	    credentialUserName: string;
	    credentialTargetAlias: string;
	    credentialComment: string;
	    credentialPersist: number;
	    authFiles: Record<string, string>;
	
	    static createFrom(source: any = {}) {
	        return new NewLauncherLogin(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.credential = source["credential"];
	        this.credentialUserName = source["credentialUserName"];
	        this.credentialTargetAlias = source["credentialTargetAlias"];
	        this.credentialComment = source["credentialComment"];
	        this.credentialPersist = source["credentialPersist"];
	        this.authFiles = source["authFiles"];
	    }
	}
	export class LoginSession {
	    username: string;
	    userId: string;
	    alias: string;
	    loginToken: string;
	    created_at: string;
	    updated_at: string;
	    avatarImage: string;
	    avatarColor: string;
	    newLauncher?: NewLauncherLogin;
	
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
	        this.avatarImage = source["avatarImage"];
	        this.avatarColor = source["avatarColor"];
	        this.newLauncher = this.convertValues(source["newLauncher"], NewLauncherLogin);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace services {
	
	export class GitHubRelease {
	    tag_name: string;
	    html_url: string;
	
	    static createFrom(source: any = {}) {
	        return new GitHubRelease(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tag_name = source["tag_name"];
	        this.html_url = source["html_url"];
	    }
	}
	export class ImageMetadata {
	    filename: string;
	    size: number;
	    formatSize: string;
	    width: number;
	    height: number;
	    format: string;
	    contentType: string;
	
	    static createFrom(source: any = {}) {
	        return new ImageMetadata(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.filename = source["filename"];
	        this.size = source["size"];
	        this.formatSize = source["formatSize"];
	        this.width = source["width"];
	        this.height = source["height"];
	        this.format = source["format"];
	        this.contentType = source["contentType"];
	    }
	}

}

