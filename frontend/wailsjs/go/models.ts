export namespace models {
	
	export class LoginSession {
	    username: string;
	    userId: string;
	    alias: string;
	    loginToken: string;
	    created_at: string;
	    updated_at: string;
	    avatarImage: string;
	    avatarColor: string;
	
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
	    }
	}

}

export namespace services {
	
	export class DiagnosticData {
	    os: string;
	    architecture: string;
	    localAppData: string;
	    programFilesX86: string;
	    epicLauncherExe: string;
	    epicLauncherExists: boolean;
	    sessionFileWindows: string;
	    sessionFileWindowsExists: boolean;
	    sessionFileWindowsEditor: string;
	    sessionFileWindowsEditorExists: boolean;
	    epicGamesRunning: boolean;
	    epicDataDir: string;
	    epicDataDirExists: boolean;
	    lastError: string;
	
	    static createFrom(source: any = {}) {
	        return new DiagnosticData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.os = source["os"];
	        this.architecture = source["architecture"];
	        this.localAppData = source["localAppData"];
	        this.programFilesX86 = source["programFilesX86"];
	        this.epicLauncherExe = source["epicLauncherExe"];
	        this.epicLauncherExists = source["epicLauncherExists"];
	        this.sessionFileWindows = source["sessionFileWindows"];
	        this.sessionFileWindowsExists = source["sessionFileWindowsExists"];
	        this.sessionFileWindowsEditor = source["sessionFileWindowsEditor"];
	        this.sessionFileWindowsEditorExists = source["sessionFileWindowsEditorExists"];
	        this.epicGamesRunning = source["epicGamesRunning"];
	        this.epicDataDir = source["epicDataDir"];
	        this.epicDataDirExists = source["epicDataDirExists"];
	        this.lastError = source["lastError"];
	    }
	}
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

