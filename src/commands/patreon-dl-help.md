  
  ./patreon-downloader/PatreonDownloader.App.exe --help
  
  --url                                   Required. Url of the creator's page

  --descriptions                          (Default: false) Save post descriptions

  --embeds                                (Default: false) Save embedded content metadata

  --json                                  (Default: false) Save json data

  --campaign-images                       (Default: false) Download campaign's avatar and cover images

  --download-directory                    Directory to save all downloaded files in, default:
                                          #AppDirectory#/downloads/#CreatorName#.

  --log-level                             (Default: Default) Logging level. Possible options: Default, Debug, Trace. Affects    
                                          both console and file logging.

  --log-save                              (Default: false) Create log files in the "logs" directory.

  --file-exists-action                    (Default: BackupIfDifferent) What to do with files already existing on the disk.      
                                          Possible options:
                                          BackupIfDifferent: Check remote file size if enabled and available. If it's different,
                                          disabled or not available then download remote file and compare it with existing file,
                                          create a backup copy of old file if they are different.
                                          ReplaceIfDifferent: Same as BackupIfDifferent, but the backup copy of the file will   
                                          not be created.
                                          AlwaysReplace: Always replace existing file. Warning: will result in increased        
                                          bandwidth usage.
                                          KeepExisting: Always keep existing file. The most bandwidth-friendly option.

  --use-legacy-file-naming                (Default: false) Use legacy filenaming pattern (used before version 21). Not
                                          compatible with --file-exists-action BackupIfDifferent, ReplaceIfDifferent. Warning:  
                                          this is compatibility option and might be removed in the future, you should not use it
                                          unless you absolutely need it.

  --disable-remote-file-size-check        (Default: false) Do not ask the server for the file size (if it's available) and do   
                                          not use it in various pre-download checks if the file already exists on the disk.     
                                          Warning: will result in increased bandwidth usage if used with --file-exists-action   
                                          BackupIfDifferent, ReplaceIfDifferent, AlwaysReplace.

  --remote-browser-address                Advanced users only. Address of the browser with remote debugging enabled. Refer to   
                                          documentation for more details.

  --use-sub-directories                   Create a new directory inside of the download directory for every post instead of     
                                          placing all files into a single directory.

  --sub-directory-pattern                 (Default: [%PostId%] %PublishedAt% %PostTitle%) Pattern which will be used to create a
                                          name for the sub directories if --use-sub-directories is used. Supported parameters:  
                                          %PostId%, %PublishedAt%, %PostTitle%.

  --max-sub-directory-name-length         (Default: 100) Limits the length of the name for the subdirectories created when      
                                          --use-sub-directories is used.

  --max-filename-length                   (Default: 100) All names of downloaded files will be truncated so their length won't  
                                          be more than specified value (excluding file extension)

  --filenames-fallback-to-content-type    (Default: false) Fallback to using filename generated from url hash if the server     
                                          returns file content type (extension) and all other methods have failed. Use with     
                                          caution, this might result in unwanted files being created or the same files being    
                                          downloaded on every run under different names.

  --proxy-server-address                  The address of proxy server to use in the following format:
                                          [<proxy-scheme>://]<proxy-host>[:<proxy-port>]. Supported protocols: http(s), socks4, 
                                          socks4a, socks5.

  --help                                  Display this help screen.

  --version                               Display version information.
