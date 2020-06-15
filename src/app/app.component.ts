import { Component, ViewChild } from '@angular/core';
declare var MediaRecorder: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('video') video: any;
  title = 'record-stream';
  stream: any;
  isRecording: boolean;
  mediaRecorder: any;
  recordedBlobs: Blob[];
  downloadUrl: any;

  ngOnInit() {
    this.isRecording = false;
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        this.stream = stream;
        this.video.nativeElement.srcObject = this.stream;
      });
  }

  startRecording() {
    console.log('is recording');
    this.isRecording = true;
    this.recordedBlobs = [];
    // let options: MediaRecorderOptions = { mimeType: 'video/webm' }

    try {
      this.mediaRecorder = new MediaRecorder(this.stream);
      console.log(this.mediaRecorder);
    } catch (err) {
      console.log(err);
    }

    this.mediaRecorder.start(); // collect 100ms of data
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = false;
    console.log('Recorded Blobs: ', this.recordedBlobs);

    this.onDataAvailableEvent();
    this.onStopRecordingEvent();
  }

  onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event) => {
        console.log(event.data);
        if (event.data && event.data.size > 0) {
          this.recordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  onStopRecordingEvent() {
    this.mediaRecorder.onstop = (event: Event) => {
      const videoBuffer = new Blob(this.recordedBlobs, { type: 'video/webm' });
      console.log(videoBuffer);
      console.log(this.recordedBlobs);
      this.downloadUrl = window.URL.createObjectURL(videoBuffer); // you can download with <a> tag

      var recordedVideo = document.createElement('video');
      recordedVideo.src = this.downloadUrl;
      recordedVideo.setAttribute('controls', 'controls');

      var downloadLink = document.createElement('a');
      downloadLink.href = this.downloadUrl;
      downloadLink.download = 'recordedStream.webm';
      downloadLink.text = 'Download';
      document.body.appendChild(recordedVideo);
      document.body.appendChild(document.createElement('br'));
      document.body.appendChild(document.createElement('br'));
      document.body.appendChild(downloadLink);
      document.body.appendChild(document.createElement('br'));
      document.body.appendChild(document.createElement('br'));
      document.body.appendChild(document.createElement('br'));
    };
  }
}
